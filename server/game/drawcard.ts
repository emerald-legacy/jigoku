import BaseCard from './basecard';
import { SkillCalculator } from './SkillCalculator';
import DuplicateUniqueAction from './duplicateuniqueaction.js';
import CourtesyAbility from './KeywordAbilities/CourtesyAbility';
import PrideAbility from './KeywordAbilities/PrideAbility';
import SincerityAbility from './KeywordAbilities/SincerityAbility';
import { RallyAbility } from './KeywordAbilities/RallyAbility.js';
import StatModifier from './StatModifier';

import { Locations, EffectNames, CardTypes, PlayTypes, ConflictTypes, EventNames } from './Constants';
import { GameModes } from '../GameModes';
import { EventRegistrar } from './EventRegistrar';
import { ThrivingAbility } from './KeywordAbilities/ThrivingAbility';
import type Player from './player';
import type Ring from './ring';
import type { AbilityContext } from './AbilityContext';
import type { CardData } from './types/CardData';

interface MenuItem {
    command: string;
    text: string;
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
    parent: DrawCard | null;
    printedMilitarySkill: number;
    printedPoliticalSkill: number;
    printedCost: number | null;
    printedGlory: number;
    printedStrengthBonus: number;
    fate: number;
    bowed: boolean;
    covert: boolean;
    declare isConflict: boolean;
    declare isDynasty: boolean;
    allowDuplicatesOfAttachment: boolean;
    inConflict: boolean = false;
    new: boolean = false;
    private skillCalculator: SkillCalculator;

    constructor(owner: Player, cardData: CardData) {
        super(owner, cardData);
        this.skillCalculator = new SkillCalculator(this);

        this.defaultController = owner;
        this.parent = null;

        this.printedMilitarySkill = this.getPrintedSkill('military');
        this.printedPoliticalSkill = this.getPrintedSkill('political');
        this.printedCost = parseInt(this.cardData.cost);

        if(typeof this.printedCost !== 'number' || isNaN(this.printedCost)) {
            if(this.type === CardTypes.Event) {
                this.printedCost = 0;
            } else {
                this.printedCost = null;
            }
        }
        this.printedGlory = parseInt(cardData.glory);
        this.printedStrengthBonus = parseInt(cardData.strength_bonus);
        this.fate = 0;
        this.bowed = false;
        this.covert = false;
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.allowDuplicatesOfAttachment = !!cardData.attachment_allow_duplicates;

        if(cardData.type === CardTypes.Character) {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new PrideAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
        }
        if(cardData.type === CardTypes.Attachment) {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
        }
        if(cardData.type === CardTypes.Event && this.hasEphemeral()) {
            this.eventRegistrarForEphemeral = new EventRegistrar(this.game, this);
            this.eventRegistrarForEphemeral.register([{ [EventNames.OnCardPlayed]: 'handleEphemeral' }]);
        }
        if(cardData.type === CardTypes.Attachment && this.hasEphemeral()) {
            this.eventRegistrarForEphemeral = new EventRegistrar(this.game, this);
            this.eventRegistrarForEphemeral.register([{ [EventNames.OnCardLeavesPlay]: 'handleEphemeral' }]);
        }
        if(cardData.type === CardTypes.Character && this.hasEphemeral()) {
            this.eventRegistrarForEphemeral = new EventRegistrar(this.game, this);
            this.eventRegistrarForEphemeral.register([{ [EventNames.OnCardLeavesPlay]: 'handleEphemeral' }]);
        }
        if(this.isDynasty) {
            this.abilities.reactions.push(new RallyAbility(this.game, this));
            this.abilities.reactions.push(new ThrivingAbility(this.game, this));
        }
    }

    handleEphemeral(event: any): void {
        if(event.card === this) {
            if(this.location !== Locations.RemovedFromGame) {
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
            this.fromOutOfPlaySource = undefined;
        }
    }

    getPrintedSkill(type: string): number {
        if(type === 'military') {
            return this.cardData.military === null || this.cardData.military === undefined
                ? NaN
                : isNaN(parseInt(this.cardData.military))
                    ? 0
                    : parseInt(this.cardData.military);
        } else if(type === 'political') {
            return this.cardData.political === null || this.cardData.political === undefined
                ? NaN
                : isNaN(parseInt(this.cardData.political))
                    ? 0
                    : parseInt(this.cardData.political);
        }
        return NaN;
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

    hasPeaceful(): boolean {
        return this.hasPrintedKeyword('peaceful');
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
        const copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        return copyEffect ? copyEffect.printedCost : this.printedCost;
    }

    getFate(): number {
        const rawEffects = this.getRawEffects().filter((effect: any) => effect.type === EffectNames.SetApparentFate);
        const apparentFate = this.mostRecentEffect(EffectNames.SetApparentFate);
        return rawEffects.length > 0 ? apparentFate : this.fate;
    }

    isInConflictProvince(): boolean {
        return this.game.currentConflict.isCardInConflictProvince(this);
    }

    costLessThan(num: number): boolean {
        const cost = this.printedCost;
        return num && (cost || cost === 0) && cost < num;
    }

    anotherUniqueInPlay(player: Player): boolean {
        return (
            this.isUnique() &&
            this.game.allCards.some(
                (card: any) =>
                    card.isInPlay() &&
                    card.printedName === this.printedName &&
                    card !== this &&
                    (card.owner === player || card.controller === player || card.owner === this.owner)
            )
        );
    }

    anotherUniqueInPlayControlledBy(player: Player): boolean {
        return (
            this.isUnique() &&
            this.game.allCards.some(
                (card: any) =>
                    card.isInPlay() &&
                    card.printedName === this.printedName &&
                    card !== this &&
                    card.controller === player
            )
        );
    }

    createSnapshot(): DrawCard {
        // Use Object.create to skip expensive constructor (setupCardAbilities, parseKeywords, uuid generation)
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

        // Shallow copy arrays
        clone.effects = [...this.effects];
        const clonedIndex = new Map();
        for(const [k, v] of (this as any).effectsByType) {
            clonedIndex.set(k, [...v]);
        }
        (clone as any).effectsByType = clonedIndex;
        clone.statusManager = this.statusManager.cloneFor(clone);
        (clone as any).skillCalculator = new SkillCalculator(clone);
        clone.traits = Array.from(this.getTraits());
        clone.tokens = Object.assign({}, this.tokens);
        clone.printedKeywords = this.printedKeywords;

        // Recursive snapshot for nested cards
        clone.attachments = this.attachments.map((attachment: DrawCard) => attachment.createSnapshot());
        clone.childCards = this.childCards.map((card: DrawCard) => card.createSnapshot());

        return clone;
    }

    hasDash(type: string = ''): boolean {
        if(type === 'glory' || this.printedType !== CardTypes.Character) {
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
        const skillFunction = this.mostRecentEffect(EffectNames.ChangeContributionFunction);
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
        return this.location === Locations.PlayArea && this.type === CardTypes.Character;
    }

    get militarySkillSummary(): { stat?: string; modifiers?: any[] } {
        if(!this.showStats) {
            return {};
        }
        const modifiers = this.skillCalculator.getMilitaryModifiers().map((modifier: any) => Object.assign({}, modifier));
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        return {
            stat: isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get politicalSkillSummary(): { stat?: string; modifiers?: any[] } {
        if(!this.showStats) {
            return {};
        }
        const modifiers = this.skillCalculator.getPoliticalModifiers().map((modifier: any) => Object.assign({}, modifier));
        modifiers.forEach((modifier: any) => (modifier = Object.assign({}, modifier)));
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        return {
            stat: isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get glorySummary(): { stat?: string; modifiers?: any[] } {
        if(!this.showStats) {
            return {};
        }
        const modifiers = this.skillCalculator.getGloryModifiers().map((modifier: any) => Object.assign({}, modifier));
        modifiers.forEach((modifier: any) => (modifier = Object.assign({}, modifier)));
        const stat = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        return {
            stat: Math.max(stat, 0).toString(),
            modifiers: modifiers
        };
    }

    get glory(): number {
        return this.getGlory();
    }

    getGlory(): number {
        const gloryModifiers = this.skillCalculator.getGloryModifiers();
        const glory = gloryModifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if(isNaN(glory)) {
            return 0;
        }
        return Math.max(0, glory);
    }

    getProvinceStrengthBonus(): number {
        const modifiers = this.skillCalculator.getProvinceStrengthBonusModifiers();
        const bonus = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if(bonus && this.isFaceup()) {
            return bonus;
        }
        return 0;
    }

    getStatusTokenSkill(): number {
        return this.skillCalculator.getStatusTokenSkill();
    }

    getMilitaryModifiers(exclusions?: any): any[] {
        return this.skillCalculator.getMilitaryModifiers(exclusions);
    }

    getPoliticalModifiers(exclusions?: any): any[] {
        return this.skillCalculator.getPoliticalModifiers(exclusions);
    }

    get militarySkill(): number {
        return this.getMilitarySkill();
    }

    getMilitarySkill(floor: boolean = true): number {
        const modifiers = this.skillCalculator.getMilitaryModifiers();
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if(isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    getMilitarySkillExcludingModifiers(exclusions: any, floor: boolean = true): number {
        if(!Array.isArray(exclusions) && typeof exclusions !== 'function') {
            exclusions = [exclusions];
        }
        const modifiers = this.skillCalculator.getMilitaryModifiers(exclusions);
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if(isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get politicalSkill(): number {
        return this.getPoliticalSkill();
    }

    getPoliticalSkill(floor: boolean = true): number {
        const modifiers = this.skillCalculator.getPoliticalModifiers();
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if(isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    getPoliticalSkillExcludingModifiers(exclusions: any, floor: boolean = true): number {
        if(!Array.isArray(exclusions) && typeof exclusions !== 'function') {
            exclusions = [exclusions];
        }
        const modifiers = this.skillCalculator.getPoliticalModifiers(exclusions);
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if(isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get baseMilitarySkill(): number {
        return this.getBaseMilitarySkill();
    }

    getBaseMilitarySkill(): number {
        const skill = this.skillCalculator.getBaseSkillModifiers().baseMilitarySkill;
        if(isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    get basePoliticalSkill(): number {
        return this.getBasePoliticalSkill();
    }

    getBasePoliticalSkill(): number {
        const skill = this.skillCalculator.getBaseSkillModifiers().basePoliticalSkill;
        if(isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    getContributionToImperialFavor(): number {
        const canConributeWhileBowed = this.anyEffect(EffectNames.CanContributeGloryWhileBowed);
        const contributesGlory = canConributeWhileBowed || !this.bowed;
        return contributesGlory ? this.glory : 0;
    }

    modifyFate(amount: number): void {
        /**
         * @param amount - the amount of fate to modify this card's fate total by
         */
        this.fate = Math.max(0, this.fate + amount);
    }

    bow(): void {
        this.bowed = true;
    }

    ready(): void {
        this.bowed = false;
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

    getActions(location: string = this.location): any[] {
        if(location === Locations.PlayArea || this.type === CardTypes.Event) {
            return super.getActions();
        }
        const actions = this.type === CardTypes.Character ? [new DuplicateUniqueAction(this)] : [];
        return actions.concat(this.getPlayActions(), super.getActions());
    }

    /**
     * Deals with the engine effects of leaving play, making sure all statuses are removed. Anything which changes
     * the state of the card should be here. This is also called in some strange corner cases e.g. for attachments
     * which aren't actually in play themselves when their parent (which is in play) leaves play.
     */
    leavesPlay(): void {
        // If this is an attachment and is attached to another card, we need to remove all links between them
        if(this.parent && this.parent.attachments) {
            this.parent.removeAttachment(this);
            this.parent = null;
        }

        // Remove any cards underneath from the game
        const cardsUnderneath = this.controller.getSourceList(this.uuid).map((a: any) => a);
        if(cardsUnderneath.length > 0) {
            cardsUnderneath.forEach((card: any) => {
                this.controller.moveCard(card, Locations.RemovedFromGame);
            });
            this.game.addMessage(
                '{0} {1} removed from the game due to {2} leaving play',
                cardsUnderneath,
                cardsUnderneath.length === 1 ? 'is' : 'are',
                this
            );
        }

        const cacheParticipating = this.isParticipating();

        if(this.isParticipating()) {
            this.game.currentConflict.removeFromConflict(this);
        }

        const honorStatusDoesNotAffectLeavePlayEffects = this.anyEffect(EffectNames.HonorStatusDoesNotModifySkill);
        let honorStatusDoesNotAffectLeavePlayConflictEffects = false;
        if(this.game.currentConflict) {
            honorStatusDoesNotAffectLeavePlayConflictEffects =
                cacheParticipating && this.game.currentConflict.anyEffect(EffectNames.ConflictIgnoreStatusTokens);
        }
        const ignoreHonorStatus =
            honorStatusDoesNotAffectLeavePlayEffects || honorStatusDoesNotAffectLeavePlayConflictEffects;

        if(this.isDishonored && !ignoreHonorStatus) {
            const frameworkContext = this.game.getFrameworkContext();
            const honorLossAction = this.game.actions.loseHonor();

            if(honorLossAction.canAffect(this.controller, frameworkContext)) {
                this.game.addMessage('{0} loses 1 honor due to {1}\'s personal honor', this.controller, this);
            }
            this.game.openThenEventWindow(honorLossAction.getEvent(this.controller, frameworkContext));
        } else if(this.isHonored && !ignoreHonorStatus) {
            const frameworkContext = this.game.getFrameworkContext();
            const honorGainAction = this.game.actions.gainHonor();
            if(honorGainAction.canAffect(this.controller, frameworkContext)) {
                this.game.addMessage('{0} gains 1 honor due to {1}\'s personal honor', this.controller, this);
            }
            this.game.openThenEventWindow(honorGainAction.getEvent(this.controller, frameworkContext));
        }

        this.untaint();
        this.makeOrdinary();
        this.bowed = false;
        this.covert = false;
        this.new = false;
        this.fate = 0;
        super.leavesPlay();
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
        province?: any,
        incomingAttackers?: DrawCard[]
    ): boolean {
        if(!province) {
            const provinces =
                this.game.currentConflict && this.game.currentConflict.defendingPlayer
                    ? this.game.currentConflict.defendingPlayer.getProvinces()
                    : null;
            if(provinces) {
                return provinces.some(
                    (a: any) =>
                        a.canDeclare(conflictType, ring) &&
                        this.canDeclareAsAttacker(conflictType, ring, a, incomingAttackers)
                );
            }
        }

        let attackers = this.game.isDuringConflict() ? this.game.currentConflict.attackers : [];
        if(incomingAttackers) {
            attackers = incomingAttackers;
        }
        if(!attackers.includes(this)) {
            attackers = attackers.concat(this);
        }

        // Check if I add an element that I can't attack with
        const elementsAdded = this.attachments.reduce(
            (array: any[], attachment: DrawCard) =>
                array.concat(attachment.getEffects(EffectNames.AddElementAsAttacker)),
            this.getEffects(EffectNames.AddElementAsAttacker)
        );

        if(
            elementsAdded.some((element: string) =>
                this.game.rings[element]
                    .getEffects(EffectNames.CannotDeclareRing)
                    .some((match: any) => match(this.controller))
            )
        ) {
            return false;
        }

        if(
            conflictType === ConflictTypes.Military &&
            attackers.reduce(
                (total: number, card: DrawCard) => total + card.sumEffects(EffectNames.CardCostToAttackMilitary),
                0
            ) > this.controller.hand.length
        ) {
            return false;
        }

        const fateCostToAttackProvince = province ? province.getFateCostToAttack() : 0;
        if(
            attackers.reduce(
                (total: number, card: DrawCard) => total + card.sumEffects(EffectNames.FateCostToAttack),
                0
            ) +
                fateCostToAttackProvince >
            this.controller.fate
        ) {
            return false;
        }
        if(this.anyEffect(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement)) {
            for(const element of this.getEffects(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement)) {
                if(!ring.hasElement(element) && !elementsAdded.includes(element)) {
                    return false;
                }
            }
        }

        if(this.controller.anyEffect(EffectNames.LimitLegalAttackers)) {
            const checks = this.controller.getEffects(EffectNames.LimitLegalAttackers);
            let valid = true;
            checks.forEach((check: any) => {
                if(typeof check === 'function') {
                    valid = valid && check(this);
                }
            });
            if(!valid) {
                return false;
            }
        }

        return (
            this.checkRestrictions('declareAsAttacker', this.game.getFrameworkContext()) &&
            this.canParticipateAsAttacker(conflictType) &&
            this.location === Locations.PlayArea &&
            !this.bowed
        );
    }

    canDeclareAsDefender(conflictType: string = this.game.currentConflict.conflictType): boolean {
        return (
            this.checkRestrictions('declareAsDefender', this.game.getFrameworkContext()) &&
            this.canParticipateAsDefender(conflictType) &&
            this.location === Locations.PlayArea &&
            !this.bowed &&
            !this.covert
        );
    }

    canParticipateAsAttacker(conflictType: string = this.game.currentConflict.conflictType): boolean {
        const effects = this.getEffects(EffectNames.CannotParticipateAsAttacker);
        return !effects.some((value: any) => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    canParticipateAsDefender(conflictType: string = this.game.currentConflict.conflictType): boolean {
        const effects = this.getEffects(EffectNames.CannotParticipateAsDefender);
        const hasDash = conflictType ? this.hasDash(conflictType) : false;

        return !effects.some((value: any) => value === 'both' || value === conflictType) && !hasDash;
    }

    bowsOnReturnHome(): boolean {
        return !this.anyEffect(EffectNames.DoesNotBow);
    }

    setDefaultController(player: Player): void {
        this.defaultController = player;
    }

    getModifiedController(): Player {
        if(
            this.location === Locations.PlayArea ||
            (this.type === CardTypes.Holding && (this.location as string).includes('province'))
        ) {
            return this.mostRecentEffect(EffectNames.TakeControl) || this.defaultController;
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
        const frameworkLimitsAttachmentsWithRepeatedNames =
            this.game.gameMode === GameModes.Emerald || this.game.gameMode === GameModes.Obsidian || this.game.gameMode === GameModes.Sanctuary;
        if(frameworkLimitsAttachmentsWithRepeatedNames && this.type === CardTypes.Character) {
            if(
                this.attachments
                    .filter((a: DrawCard) => !a.allowDuplicatesOfAttachment)
                    .some(
                        (a: DrawCard) =>
                            a.id === attachment.id && a.controller === attachment.controller && a !== attachment
                    )
            ) {
                return false;
            }
        }
        return super.allowAttachment(attachment);
    }

    getSummary(activePlayer: Player, hideWhenFaceup?: boolean): any {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return Object.assign(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map((attachment: DrawCard) => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            childCards: this.childCards.map((card: DrawCard) => {
                return card.getSummary(activePlayer, hideWhenFaceup);
            }),
            inConflict: this.inConflict,
            isConflict: this.isConflict,
            isDynasty: this.isDynasty,
            isPlayableByMe: this.isConflict && this.controller.isCardInPlayableLocation(this, PlayTypes.PlayFromHand),
            isPlayableByOpponent:
                this.isConflict &&
                this.controller.opponent &&
                this.controller.opponent.isCardInPlayableLocation(this, PlayTypes.PlayFromHand),
            bowed: this.bowed,
            fate: this.fate,
            new: this.new,
            covert: this.covert,
            showStats: this.showStats,
            militarySkillSummary: this.militarySkillSummary,
            politicalSkillSummary: this.politicalSkillSummary,
            glorySummary: this.glorySummary,
            controller: this.controller.getShortSummary()
        });
    }
}

export = DrawCard;
