import BaseCard, { type CardSummary } from './BaseCard.js';
import type { GameObject } from './GameObject.js';
import { AttachmentManager } from './AttachmentManager.js';
import { ChildCardManager } from './ChildCardManager.js';
import AbilityDsl from './abilitydsl.js';
import { SkillCalculator, type Exclusions } from './SkillCalculator.js';
import type StatModifier from './StatModifier.js';
import DuplicateUniqueAction from './DuplicateUniqueAction.js';
import DynastyCardAction from './DynastyCardAction.js';
import { PlayAttachmentAction } from './PlayAttachmentAction.js';
import { PlayAttachmentToRingAction } from './PlayAttachmentToRingAction.js';
import { PlayCharacterAction } from './PlayCharacterAction.js';
import { PlayDisguisedCharacterAction } from './PlayDisguisedCharacterAction.js';
import type BaseCardAbility from './BaseCardAbility.js';
import CourtesyAbility from './KeywordAbilities/CourtesyAbility.js';
import PrideAbility from './KeywordAbilities/PrideAbility.js';
import SincerityAbility from './KeywordAbilities/SincerityAbility.js';
import { RallyAbility } from './KeywordAbilities/RallyAbility.js';
import { Location, EffectName, CardType, PlayType, ConflictType, EventName, Duration, Players, AbilityType } from './Constants.js';
import { GameModes } from '../GameModes.js';
import { EventRegistrar } from './EventRegistrar.js';
import { ThrivingAbility } from './KeywordAbilities/ThrivingAbility.js';
import type Player from './Player.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Ring from './Ring.js';
import type { AbilityContext } from './AbilityContext.js';
import type { GameEvent } from './Events/EventPayloads.js';
import type { Event } from './Events/Event.js';
import type { ActionProps, ConflictActionProps, PersistentEffectProps, TriggeredAbilityProps, TriggeredAbilityWhenProps, WhenType } from './Interfaces.js';
import type { AbilityBuilder, TriggerContext } from './AbilityBuilder.js';
import type { Duel } from './Duel.js';
import type { CardData } from './types/CardData.js';
import type { GameAction } from './GameActions/GameAction.js';

interface MenuItem {
    command: string;
    text: string;
}

type StatSummary = { stat?: string; modifiers?: StatModifier[] };
type DuelCondition = (duel: Duel, context: AbilityContext<DrawCard>) => boolean;
type DuelProps<P> = Omit<P, 'when'> & { duelCondition?: DuelCondition };

const EPHEMERAL_TRIGGER: Partial<Record<string, EventName>> = {
    [CardType.Event]: EventName.OnCardPlayed,
    [CardType.Attachment]: EventName.OnCardLeavesPlay,
    [CardType.Character]: EventName.OnCardLeavesPlay
};

/** Effects already shown in the skill summaries, so not repeated as effect markers. */
const SKILL_EFFECTS: Set<string> = new Set([
    EffectName.ModifyMilitarySkill,
    EffectName.ModifyPoliticalSkill,
    EffectName.ModifyBaseMilitarySkillMultiplier,
    EffectName.ModifyBasePoliticalSkillMultiplier,
    EffectName.ModifyMilitarySkillMultiplier,
    EffectName.ModifyPoliticalSkillMultiplier,
    EffectName.ModifyGlory,
    EffectName.SetMilitarySkill,
    EffectName.SetPoliticalSkill,
    EffectName.SetBaseMilitarySkill,
    EffectName.SetBasePoliticalSkill,
    EffectName.SetGlory
]);

const MODES_LIMITING_REPEATED_ATTACHMENTS = new Set<string>([GameModes.Emerald, GameModes.Obsidian, GameModes.Sanctuary]);

function sumModifiers(modifiers: StatModifier[]): number {
    return modifiers.reduce((total, modifier) => total + modifier.amount, 0);
}

/** A dash counts as 0. */
function effectiveSkill(skill: number, floor = true): number {
    if(isNaN(skill)) {
        return 0;
    }
    return floor ? Math.max(0, skill) : skill;
}

function toExclusions(exclusions: Exclusions | EffectName): Exclusions {
    return Array.isArray(exclusions) || typeof exclusions === 'function' ? exclusions : [exclusions];
}

function statSummary(modifiers: StatModifier[], format: (stat: number) => string): StatSummary {
    const copies = modifiers.map((modifier) => Object.assign({}, modifier));
    return { stat: format(sumModifiers(copies)), modifiers: copies };
}

function formatSkill(skill: number): string {
    return isNaN(skill) ? '-' : Math.max(skill, 0).toString();
}

class DrawCard extends BaseCard {
    fromOutOfPlaySource?: BaseCard[];
    eventRegistrarForEphemeral?: EventRegistrar;

    menu: MenuItem[] = [
        { command: 'bow', text: 'Bow/Ready' },
        { command: 'honor', text: 'Honor' },
        { command: 'dishonor', text: 'Dishonor' },
        { command: 'taint', text: 'Taint/Cleanse' },
        { command: 'addfate', text: 'Add 1 fate' },
        { command: 'remfate', text: 'Remove 1 fate' },
        { command: 'move', text: 'Move into/out of conflict' },
        { command: 'control', text: 'Give control' }
    ];

    defaultController: Player;
    printedMilitarySkill: number;
    printedPoliticalSkill: number;
    printedCost: number | null;
    printedGlory: number;
    printedStrengthBonus: number;
    fate = 0;
    covert = false;
    declare isConflict: boolean;
    declare isDynasty: boolean;
    allowDuplicatesOfAttachment: boolean;
    inConflict: boolean = false;
    new: boolean = false;
    private skillCalculator: SkillCalculator;
    private childCardHost = new ChildCardManager(this);

    override checkForIllegalAttachments(): boolean {
        return this.attachmentHost.checkForIllegalAttachments();
    }

    override checkForIllegalTokens(): boolean {
        const context = this.game.getFrameworkContext(this.controller);
        let result = false;

        if(this.getType() === CardType.Attachment) {
            // cannot have fate or status tokens
            const events: Event[] = [];
            if(this.fate > 0) {
                this.game.addMessage('{0} fate is removed from {1} as it can no longer legally have fate', this.fate, this);
                this.game.actions.removeFate({ target: this, amount: this.fate }).addEventsToArray(events, context);
                result = true;
            }
            if(this.statusTokens.length > 0) {
                this.game.addMessage('Status tokens are removed from {0} as it can no longer legally have status tokens', this);
                for(const token of this.statusTokens) {
                    this.game.actions.discardStatusToken({ target: token }).addEventsToArray(events, context);
                }
                result = true;
            }
            if(events.length > 0) {
                this.game.openEventWindow(events);
                this.game.queueSimpleStep(() => context.refill());
            }
        }
        return result;
    }

    get childCards(): DrawCard[] {
        return this.childCardHost.childCards;
    }

    set childCards(value: DrawCard[]) {
        this.childCardHost.childCards = value;
    }

    addChildCard(card: DrawCard, location: Location): void {
        this.childCardHost.add(card, location);
    }

    removeChildCard(card: DrawCard | null, location: Location): void {
        this.childCardHost.remove(card, location);
    }

    constructor(owner: Player, cardData: CardData) {
        super(owner, cardData);
        this.skillCalculator = new SkillCalculator(this);

        this.defaultController = owner;

        this.printedMilitarySkill = this.getPrintedSkill('military');
        this.printedPoliticalSkill = this.getPrintedSkill('political');
        const cost = parseInt(this.cardData.cost ?? '');
        this.printedCost = isNaN(cost) ? (this.type === CardType.Event ? 0 : null) : cost;
        this.printedGlory = parseInt(cardData.glory ?? '');
        this.printedStrengthBonus = parseInt(cardData.strength_bonus ?? '');
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.allowDuplicatesOfAttachment = !!cardData.attachment_allow_duplicates;

        if(cardData.type === CardType.Character) {
            this.abilities.reactions.push(new CourtesyAbility(this), new PrideAbility(this), new SincerityAbility(this));
        }
        if(cardData.type === CardType.Attachment) {
            this.abilities.reactions.push(new CourtesyAbility(this), new SincerityAbility(this));
        }
        const ephemeralTrigger = EPHEMERAL_TRIGGER[cardData.type];
        if(ephemeralTrigger && this.hasEphemeral()) {
            this.eventRegistrarForEphemeral = new EventRegistrar(this.game, this);
            this.eventRegistrarForEphemeral.register([{ [ephemeralTrigger]: 'handleEphemeral' }]);
        }
        if(this.isDynasty) {
            this.abilities.reactions.push(new RallyAbility(this), new ThrivingAbility(this));
        }

        this.applyAttachmentBonus();
    }

    isDrawCard(): this is DrawCard {
        return true;
    }

    handleEphemeral(event: GameEvent<EventName.OnCardPlayed | EventName.OnCardLeavesPlay>): void {
        if(event.card === this) {
            if(this.location !== Location.RemovedFromGame) {
                this.owner.moveCard(this, Location.RemovedFromGame);
            }
            this.fromOutOfPlaySource = undefined;
        }
    }

    isAttachmentBonusModifierSwitchActive() {
        const switches = this.getEffects(EffectName.SwitchAttachmentSkillModifiers).filter(Boolean);
        // each pair of switches cancels each other. Need an odd number of switches to be active
        return switches.length % 2 === 1;
    }

    applyAttachmentBonus() {
        const militaryBonus = parseInt(this.cardData.military_bonus ?? '');
        const politicalBonus = parseInt(this.cardData.political_bonus ?? '');
        if(!isNaN(militaryBonus)) {
            this.persistentEffect({
                match: (card) => card === this.parent,
                targetController: Players.Any,
                effect: AbilityDsl.effects.attachmentMilitarySkillModifier(() =>
                    this.isAttachmentBonusModifierSwitchActive() ? politicalBonus : militaryBonus
                )
            });
        }
        if(!isNaN(politicalBonus)) {
            this.persistentEffect({
                match: (card) => card === this.parent,
                targetController: Players.Any,
                effect: AbilityDsl.effects.attachmentPoliticalSkillModifier(() =>
                    this.isAttachmentBonusModifierSwitchActive() ? militaryBonus : politicalBonus
                )
            });
        }
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached<T extends GameObject = GameObject>(properties: Pick<PersistentEffectProps<this, T>, 'condition' | 'match' | 'effect'>) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card as T, context)),
            targetController: Players.Any,
            effect: properties.effect
        });
    }

    getPrintedSkill(type: string): number {
        if(type === 'military') {
            return this.parsePrintedSkill(this.cardData.military);
        } else if(type === 'political') {
            return this.parsePrintedSkill(this.cardData.political);
        }
        return NaN;
    }

    // EmeraldDB writes a dash as either null or an empty string; anything else that will
    // not parse is an X printed on the card (Iron Crane Legion), which is 0.
    private parsePrintedSkill(value: string | null | undefined): number {
        if(value === null || value === undefined || value === '') {
            return NaN;
        }
        const skill = parseInt(value);
        return isNaN(skill) ? 0 : skill;
    }

    isLimited(): boolean {
        return this.hasKeyword('limited') || this.hasPrintedKeyword('limited');
    }

    isRestricted(): boolean {
        return this.hasKeyword('restricted');
    }

    isAncestral(): boolean {
        return this.hasKeyword('ancestral');
    }

    isCovert(): boolean {
        return this.hasKeyword('covert');
    }

    hasSincerity(): boolean {
        return this.hasKeyword('sincerity');
    }

    hasPride(): boolean {
        return this.hasKeyword('pride');
    }

    hasCourtesy(): boolean {
        return this.hasKeyword('courtesy');
    }

    hasEphemeral(): boolean {
        return this.hasPrintedKeyword('ephemeral');
    }

    hasNoDuels(): boolean {
        return this.hasKeyword('no duels');
    }

    isDire(): boolean {
        return this.getFate() === 0;
    }

    hasRally(): boolean {
        //Facedown cards are out of play and their keywords don't update until after the reveal reaction window is done, so we need to check for the printed keyword
        return this.hasKeyword('rally') || (!this.isBlank() && this.hasPrintedKeyword('rally'));
    }

    hasThriving(): boolean {
        return this.hasKeyword('thriving') || (!this.isBlank() && this.hasPrintedKeyword('thriving'));
    }

    getCost(): number | null {
        const copyEffect = this.mostRecentEffect(EffectName.CopyCharacter);
        return copyEffect ? copyEffect.printedCost : this.printedCost;
    }

    getFate(): number {
        return this.anyEffect(EffectName.SetApparentFate) ? this.mostRecentEffect(EffectName.SetApparentFate) : this.fate;
    }

    isInConflictProvince(): boolean {
        return !!this.game.currentConflict?.isCardInConflictProvince(this);
    }

    isAttacking(conflictType?: 'military' | 'political'): boolean {
        return !!this.game.currentConflict?.isAttacking(this) && this.isConflictOfType(conflictType);
    }

    isDefending(conflictType?: 'military' | 'political'): boolean {
        return !!this.game.currentConflict?.isDefending(this) && this.isConflictOfType(conflictType);
    }

    isParticipating(conflictType?: 'military' | 'political'): boolean {
        return !!this.game.currentConflict?.isParticipating(this) && this.isConflictOfType(conflictType);
    }

    private isConflictOfType(conflictType?: 'military' | 'political'): boolean {
        return !conflictType || this.game.isDuringConflict(conflictType);
    }

    isParticipatingFor(player: Player): boolean {
        return (this.isAttacking() && player.isAttackingPlayer()) || (this.isDefending() && player.isDefendingPlayer());
    }

    costLessThan(num: number): boolean {
        const cost = this.printedCost;
        return !!num && cost !== null && cost < num;
    }

    anotherUniqueInPlay(player: Player): boolean {
        return this.anotherUniqueCopyInPlay(
            (card) => card.owner === player || card.controller === player || card.owner === this.owner
        );
    }

    anotherUniqueInPlayControlledBy(player: Player): boolean {
        return this.anotherUniqueCopyInPlay((card) => card.controller === player);
    }

    private anotherUniqueCopyInPlay(matches: (card: BaseCard) => boolean): boolean {
        return (
            this.isUnique() &&
            this.game.allCards.some(
                (card) => card.isInPlay() && card.printedName === this.printedName && card !== this && matches(card)
            )
        );
    }

    createSnapshot(): DrawCard {
        // Use Object.create to skip expensive constructor (setupCardAbilities, parseKeywords, uuid generation)
        // so the clone has no #private members: card classes use TS `private` for anything a snapshot may call
        const clone = Object.create(DrawCard.prototype) as DrawCard;

        // Copy base identity properties
        clone.owner = this.owner;
        clone.cardData = this.cardData;
        clone.game = this.game;
        clone.id = this.id;
        clone.printedName = this.printedName;
        clone.printedType = this.printedType;
        clone.printedFaction = this.printedFaction;
        clone.uuid = this.uuid;

        // Copy game state
        clone.controller = this.controller;
        clone.location = this.location;
        clone.bowed = this.bowed;
        clone.fate = this.fate;
        clone.inConflict = this.inConflict;
        clone.parent = this.parent;
        clone.facedown = this.facedown;

        // Copy printed stats
        clone.printedMilitarySkill = this.printedMilitarySkill;
        clone.printedPoliticalSkill = this.printedPoliticalSkill;
        clone.printedCost = this.printedCost;
        clone.printedGlory = this.printedGlory;
        clone.printedStrengthBonus = this.printedStrengthBonus;

        // Copy effect-tracking state (incl. suppressEffectCount) via GameObject helper
        this.cloneEffectStateInto(clone);
        clone.statusManager = this.statusManager.cloneFor(clone);
        clone.skillCalculator = new SkillCalculator(clone);
        clone.traits = Array.from(this.getTraits());
        clone.tokens = Object.assign({}, this.tokens);
        clone.printedKeywords = this.printedKeywords;
        clone.attachmentHost = new AttachmentManager(clone);
        clone.childCardHost = new ChildCardManager(clone);

        // Recursive snapshot for nested cards
        clone.attachments = this.attachments.map((attachment: DrawCard) => attachment.createSnapshot());
        clone.childCards = this.childCards.map((card: DrawCard) => card.createSnapshot());

        return clone;
    }

    hasDash(type: string = ''): boolean {
        if(type === 'glory' || this.printedType !== CardType.Character) {
            return false;
        }

        const baseSkillModifiers = this.skillCalculator.getBaseSkillModifiers();

        if(type === 'military') {
            return isNaN(baseSkillModifiers.baseMilitarySkill);
        } else if(type === 'political') {
            return isNaN(baseSkillModifiers.basePoliticalSkill);
        }

        return isNaN(baseSkillModifiers.baseMilitarySkill) || isNaN(baseSkillModifiers.basePoliticalSkill);
    }

    getContributionToConflict(type: string): number {
        const skillFunction = this.mostRecentEffect(EffectName.ChangeContributionFunction);
        if(skillFunction) {
            return skillFunction(this);
        }
        return this.getSkill(type);
    }

    /**
     * Direct the skill query to the correct sub function.
     * @param type - The type of the skill; military or political
     * @return The chosen skill value
     */
    getSkill(type: string): number {
        if(type === 'military') {
            return this.getMilitarySkill();
        } else if(type === 'political') {
            return this.getPoliticalSkill();
        }
        return 0;
    }

    get showStats(): boolean {
        return this.location === Location.PlayArea && this.type === CardType.Character;
    }

    get militarySkillSummary(): StatSummary {
        return this.showStats ? statSummary(this.skillCalculator.getMilitaryModifiers(), formatSkill) : {};
    }

    get politicalSkillSummary(): StatSummary {
        return this.showStats ? statSummary(this.skillCalculator.getPoliticalModifiers(), formatSkill) : {};
    }

    get glorySummary(): StatSummary {
        return this.showStats ? statSummary(this.skillCalculator.getGloryModifiers(), (glory) => Math.max(glory, 0).toString()) : {};
    }

    get glory(): number {
        return this.getGlory();
    }

    getGlory(): number {
        return effectiveSkill(sumModifiers(this.skillCalculator.getGloryModifiers()));
    }

    getProvinceStrengthBonus(): number {
        const bonus = sumModifiers(this.skillCalculator.getProvinceStrengthBonusModifiers());
        return bonus && this.isFaceup() ? bonus : 0;
    }

    getStatusTokenSkill(): number {
        return this.skillCalculator.getStatusTokenSkill();
    }

    getMilitaryModifiers(exclusions?: Exclusions): StatModifier[] {
        return this.skillCalculator.getMilitaryModifiers(exclusions);
    }

    getPoliticalModifiers(exclusions?: Exclusions): StatModifier[] {
        return this.skillCalculator.getPoliticalModifiers(exclusions);
    }

    get militarySkill(): number {
        return this.getMilitarySkill();
    }

    getMilitarySkill(floor: boolean = true): number {
        return effectiveSkill(sumModifiers(this.skillCalculator.getMilitaryModifiers()), floor);
    }

    getMilitarySkillExcludingModifiers(exclusions: Exclusions | EffectName, floor: boolean = true): number {
        return effectiveSkill(sumModifiers(this.skillCalculator.getMilitaryModifiers(toExclusions(exclusions))), floor);
    }

    get politicalSkill(): number {
        return this.getPoliticalSkill();
    }

    getPoliticalSkill(floor: boolean = true): number {
        return effectiveSkill(sumModifiers(this.skillCalculator.getPoliticalModifiers()), floor);
    }

    getPoliticalSkillExcludingModifiers(exclusions: Exclusions | EffectName, floor: boolean = true): number {
        return effectiveSkill(sumModifiers(this.skillCalculator.getPoliticalModifiers(toExclusions(exclusions))), floor);
    }

    get baseMilitarySkill(): number {
        return this.getBaseMilitarySkill();
    }

    getBaseMilitarySkill(): number {
        return effectiveSkill(this.skillCalculator.getBaseSkillModifiers().baseMilitarySkill);
    }

    get basePoliticalSkill(): number {
        return this.getBasePoliticalSkill();
    }

    getBasePoliticalSkill(): number {
        return effectiveSkill(this.skillCalculator.getBaseSkillModifiers().basePoliticalSkill);
    }

    getContributionToImperialFavor(): number {
        const contributesGlory = this.anyEffect(EffectName.CanContributeGloryWhileBowed) || !this.bowed;
        return contributesGlory ? this.glory : 0;
    }

    modifyFate(amount: number): void {
        this.fate = Math.max(0, this.fate + amount);
    }

    canPlay(context: AbilityContext, type: string = 'play'): boolean {
        return (
            this.checkRestrictions(type, context) &&
            context.player.checkRestrictions(type, context) &&
            this.checkRestrictions('play', context) &&
            context.player.checkRestrictions('play', context) &&
            (!this.hasPrintedKeyword('peaceful') || !this.game.currentConflict)
        );
    }

    getActions(location: string = this.location): BaseCardAbility[] {
        if(location === Location.PlayArea || this.type === CardType.Event) {
            return super.getActions();
        }
        const actions: BaseCardAbility[] = this.type === CardType.Character ? [new DuplicateUniqueAction(this)] : [];
        return actions.concat(this.getPlayActions(), super.getActions());
    }

    getPlayActions(): BaseCardAbility[] {
        if(this.type === CardType.Event) {
            return this.getActions();
        }
        const actions = this.abilities.playActions.slice();
        if(this.type === CardType.Character) {
            if(this.disguisedKeywordTraits.length > 0) {
                actions.push(new PlayDisguisedCharacterAction(this));
            }
            if(this.isDynasty) {
                actions.push(new DynastyCardAction(this));
            } else {
                actions.push(new PlayCharacterAction(this));
            }
        } else if(this.type === CardType.Attachment && this.mustAttachToRing()) {
            actions.push(new PlayAttachmentToRingAction(this));
        } else if(this.type === CardType.Attachment) {
            actions.push(new PlayAttachmentAction(this));
        }
        return actions;
    }

    /**
     * Deals with the engine effects of leaving play, making sure all statuses are removed. Anything which changes
     * the state of the card should be here. This is also called in some strange corner cases e.g. for attachments
     * which aren't actually in play themselves when their parent (which is in play) leaves play.
     */
    leavesPlay(_destination?: string): void {
        // If this is an attachment and is attached to another card, we need to remove all links between them
        if(this.parent && this.parent.attachments) {
            this.parent.removeAttachment(this);
            this.parent = null;
        }

        // Remove any cards underneath from the game
        const cardsUnderneath = [...this.controller.getSourceList(this.uuid)];
        if(cardsUnderneath.length > 0) {
            for(const card of cardsUnderneath) {
                this.controller.moveCard(card, Location.RemovedFromGame);
            }
            this.game.addMessage(
                '{0} {1} removed from the game due to {2} leaving play',
                cardsUnderneath,
                cardsUnderneath.length === 1 ? 'is' : 'are',
                this
            );
        }

        const wasParticipating = this.isParticipating();
        if(wasParticipating) {
            this.game.currentConflict?.removeFromConflict(this);
        }

        const ignoreHonorStatus =
            this.anyEffect(EffectName.HonorStatusDoesNotModifySkill) ||
            (wasParticipating && !!this.game.currentConflict?.anyEffect(EffectName.ConflictIgnoreStatusTokens));
        if(!ignoreHonorStatus) {
            if(this.isDishonored) {
                this.applyPersonalHonor(
                    this.game.actions.loseHonor({ amount: 1, dueToStatusToken: true }),
                    '{0} loses 1 honor due to {1}\'s personal honor'
                );
            } else if(this.isHonored) {
                this.applyPersonalHonor(
                    this.game.actions.gainHonor({ amount: 1, dueToStatusToken: true }),
                    '{0} gains 1 honor due to {1}\'s personal honor'
                );
            }
        }

        this.untaint();
        this.makeOrdinary();
        this.bowed = false;
        this.covert = false;
        this.new = false;
        this.fate = 0;
        super.leavesPlay();
    }

    private applyPersonalHonor(action: GameAction, message: string): void {
        const frameworkContext = this.game.getFrameworkContext();
        if(action.canAffect(this.controller, frameworkContext)) {
            this.game.addMessage(message, this.controller, this);
        }
        this.game.openThenEventWindow(action.getEvent(this.controller, frameworkContext));
    }

    resetForConflict(): void {
        this.covert = false;
        this.inConflict = false;
    }

    canBeBypassedByCovert(context: AbilityContext): boolean {
        return !this.isCovert() && this.checkRestrictions('applyCovert', context);
    }

    canDeclareAsAttacker(
        conflictType: string,
        ring: Ring,
        province?: ProvinceCard | null,
        incomingAttackers?: DrawCard[]
    ): boolean {
        if(!province) {
            const provinces = this.game.currentConflict?.defendingPlayer?.getProvinces();
            if(provinces) {
                return provinces.some(
                    (a) =>
                        a.canDeclare(conflictType, ring) &&
                        this.canDeclareAsAttacker(conflictType, ring, a, incomingAttackers)
                );
            }
        }

        const currentAttackers = this.game.isDuringConflict() && this.game.currentConflict ? this.game.currentConflict.attackers : [];
        let attackers = incomingAttackers || currentAttackers;
        if(!attackers.includes(this)) {
            attackers = attackers.concat(this);
        }
        const sumOverAttackers = (effect: EffectName) => attackers.reduce((total, card) => total + card.sumEffects(effect), 0);

        // Check if I add an element that I can't attack with
        const elementsAdded = [this, ...this.attachments].flatMap((card) => card.getEffects(EffectName.AddElementAsAttacker)).flat();

        if(
            elementsAdded.some((element: string) =>
                this.game.rings[element]
                    .getEffects(EffectName.CannotDeclareRing)
                    .some((match) => match(this.controller))
            )
        ) {
            return false;
        }

        if(conflictType === ConflictType.Military && sumOverAttackers(EffectName.CardCostToAttackMilitary) > this.controller.hand.length) {
            return false;
        }

        const fateCostToAttackProvince = province ? province.getFateCostToAttack() : 0;
        if(sumOverAttackers(EffectName.FateCostToAttack) + fateCostToAttackProvince > this.controller.fate) {
            return false;
        }
        if(this.anyEffect(EffectName.CanOnlyBeDeclaredAsAttackerWithElement)) {
            for(const element of this.getEffects(EffectName.CanOnlyBeDeclaredAsAttackerWithElement)) {
                if(!ring.hasElement(element) && !elementsAdded.includes(element)) {
                    return false;
                }
            }
        }

        const frameworkContext = this.game.getFrameworkContext();

        if(this.anyEffect(EffectName.CanOnlyBeDeclaredAsAttackerWithCondition)) {
            for(const condition of this.getEffects(EffectName.CanOnlyBeDeclaredAsAttackerWithCondition)) {
                if(!condition({ context: frameworkContext, conflictType, ring, province, incomingAttackers })) {
                    return false;
                }
            }
        }

        if(this.controller.anyEffect(EffectName.LimitLegalAttackers)) {
            const checks = this.controller.getEffects(EffectName.LimitLegalAttackers);
            if(!checks.every((check) => typeof check !== 'function' || check(this))) {
                return false;
            }
        }

        return (
            this.checkRestrictions('declareAsAttacker', frameworkContext) &&
            this.canParticipateAsAttacker(conflictType) &&
            this.location === Location.PlayArea &&
            !this.bowed
        );
    }

    canDeclareAsDefender(conflictType: string = this.game.currentConflict?.conflictType ?? ''): boolean {
        return (
            this.checkRestrictions('declareAsDefender', this.game.getFrameworkContext()) &&
            this.canParticipateAsDefender(conflictType) &&
            this.location === Location.PlayArea &&
            !this.bowed &&
            !this.covert
        );
    }

    canParticipateAsAttacker(conflictType: string = this.game.currentConflict?.conflictType ?? ''): boolean {
        const effects = this.getEffects(EffectName.CannotParticipateAsAttacker);
        return !effects.some((value) => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    canParticipateAsDefender(conflictType: string = this.game.currentConflict?.conflictType ?? ''): boolean {
        const effects = this.getEffects(EffectName.CannotParticipateAsDefender);
        const hasDash = conflictType ? this.hasDash(conflictType) : false;

        return !effects.some((value) => value === 'both' || value === conflictType) && !hasDash;
    }

    bowsOnReturnHome(): boolean {
        return !this.anyEffect(EffectName.DoesNotBow);
    }

    setDefaultController(player: Player): void {
        this.defaultController = player;
    }

    getModifiedController(): Player {
        if(
            this.location === Location.PlayArea ||
            (this.type === CardType.Holding && (this.location as string).includes('province'))
        ) {
            return this.mostRecentEffect(EffectName.TakeControl) || this.defaultController;
        }
        return this.owner;
    }

    canDisguise(card: DrawCard, context: AbilityContext, intoConflictOnly: boolean): boolean {
        return (
            this.disguisedKeywordTraits.some((trait: string) => card.hasTrait(trait)) &&
            card.allowGameAction('discardFromPlay', context) &&
            !card.isUnique() &&
            (!intoConflictOnly || card.isParticipating())
        );
    }

    play(): void {
        //empty function so playcardaction doesn't crash the game
    }

    allowAttachment(attachment: BaseCard | DrawCard): boolean {
        if(
            MODES_LIMITING_REPEATED_ATTACHMENTS.has(this.game.gameMode) &&
            this.type === CardType.Character &&
            this.attachments.some(
                (a) =>
                    !a.allowDuplicatesOfAttachment &&
                    a.id === attachment.id &&
                    a.controller === attachment.controller &&
                    a !== attachment
            )
        ) {
            return false;
        }
        return super.allowAttachment(attachment);
    }

    getEffectMarkers(): Array<{ source: string; kind: 'delayed' | 'modifier' }> {
        const engine = this.game?.effectEngine;
        if(!engine || !Array.isArray(engine.effects)) {
            return [];
        }
        const seen = new Set<string>();
        const matching: Array<{ source: string; kind: 'delayed' | 'modifier' }> = [];
        for(const e of engine.effects) {
            if(!e || e.duration === Duration.Persistent) {
                continue;
            }
            const targetsThis = (Array.isArray(e.targets) && e.targets.includes(this)) || e.match === this;
            if(!targetsThis) {
                continue;
            }
            const sourceObj = e.context?.source;
            if(sourceObj?.printedType === 'token') {
                continue;
            }
            const effectType: string = e.effect?.type || '';
            const isDelayed = effectType === EffectName.DelayedEffect;
            if(!isDelayed && SKILL_EFFECTS.has(effectType)) {
                continue;
            }
            const source = sourceObj?.name || 'Unknown';
            const kind = isDelayed ? 'delayed' : 'modifier';
            const key = `${source}|${kind}`;
            if(seen.has(key)) {
                continue;
            }
            seen.add(key);
            matching.push({ source, kind });
        }
        return matching;
    }

    getSummary(activePlayer: Player, hideWhenFaceup?: boolean): CardSummary {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup ?? false);

        return Object.assign(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map((attachment) => attachment.getSummary(activePlayer, hideWhenFaceup)),
            childCards: this.childCards.map((card) => card.getSummary(activePlayer, hideWhenFaceup)),
            inConflict: this.inConflict,
            isConflict: this.isConflict,
            isDynasty: this.isDynasty,
            isPlayableByMe: this.isConflict && this.controller.isCardInPlayableLocation(this, PlayType.PlayFromHand),
            isPlayableByOpponent:
                this.isConflict &&
                this.controller.opponent &&
                this.controller.opponent.isCardInPlayableLocation(this, PlayType.PlayFromHand),
            bowed: this.bowed,
            fate: this.fate,
            new: this.new,
            covert: this.covert,
            showStats: this.showStats,
            militarySkillSummary: this.militarySkillSummary,
            politicalSkillSummary: this.politicalSkillSummary,
            glorySummary: this.glorySummary,
            controller: this.controller.getShortSummary(),
            effectMarkers: this.getEffectMarkers()
        });
    }

    duelChallenge(properties: DuelProps<TriggeredAbilityProps>): void {
        this.triggeredAbility(AbilityType.DuelReaction, {
            ...properties,
            when: { onDuelChallenge: duelTrigger((duel, player) => duel.playerCanTriggerChallenge(player), properties.duelCondition) }
        });
    }

    duelFocus(properties: DuelProps<TriggeredAbilityWhenProps>): void;
    duelFocus(title: string, duelCondition?: DuelCondition): AbilityBuilder<TriggerContext<this, Pick<WhenType<this>, EventName.OnDuelFocus>>>;
    duelFocus(
        properties: DuelProps<TriggeredAbilityWhenProps> | string,
        duelCondition?: DuelCondition
    ): void | AbilityBuilder<TriggerContext<this, Pick<WhenType<this>, EventName.OnDuelFocus>>> {
        const canTrigger = (duel: Duel, player: Player) => duel.playerCanTriggerFocus(player);
        if(typeof properties === 'string') {
            return this.triggerBuilder(AbilityType.DuelReaction, properties).when({
                onDuelFocus: duelTrigger(canTrigger, duelCondition)
            });
        }
        this.triggeredAbility(AbilityType.DuelReaction, {
            ...properties,
            when: { onDuelFocus: duelTrigger(canTrigger, properties.duelCondition) }
        });
    }

    duelStrike(properties: DuelProps<TriggeredAbilityProps>): void {
        this.triggeredAbility(AbilityType.DuelReaction, {
            ...properties,
            when: { onDuelStrike: duelTrigger((duel, player) => duel.playerCanTriggerStrike(player), properties.duelCondition) }
        });
    }

    conflictAction<Target extends BaseCard = BaseCard>(properties: ConflictActionProps<this, Target>): void {
        const condition = properties.condition;
        const finalProperties = {
            ...properties,
            condition: (context: AbilityContext<this, Target>) =>
                context.source.game.isDuringConflict() &&
                (properties.evenFromHome || context.source.isParticipating(properties.conflictType)) &&
                (condition?.(context) ?? true)
        };
        this.registerAbility(() => this.abilities.actions.push(this.createAction(finalProperties as ActionProps)));
    }
}

function duelTrigger(canTrigger: (duel: Duel, player: Player) => boolean, duelCondition?: DuelCondition) {
    return ({ duel }: { duel?: Duel }, context?: AbilityContext<DrawCard>): boolean =>
        !!context && !!duel && canTrigger(duel, context.player) && (!duelCondition || duelCondition(duel, context));
}

export default DrawCard;
