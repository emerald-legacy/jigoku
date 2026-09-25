import { AttachmentManager } from './AttachmentManager.js';
import type DrawCard from './DrawCard.js';
import AbilityDsl from './abilitydsl.js';
import Effects from './effects.js';
import EffectSource from './EffectSource.js';
import { CardStatusManager } from './CardStatusManager.js';
import CardAbility from './CardAbility.js';
import TriggeredAbility from './TriggeredAbility.js';
import type { TriggeredAbilityProperties } from './TriggeredAbility.js';
import type BaseCardAbility from './BaseCardAbility.js';
import Game from './Game.js';

import { type ActionContext, AbilityBuilder, TriggerBuilder, actionProperties, createDraft, holdsTriggerEvent, triggeredProperties } from './AbilityBuilder.js';
import { AbilityContext } from './AbilityContext.js';
import { CardAction } from './CardAction.js';
import {
    AbilityType,
    CardType,
    CharacterStatus,
    Duration,
    EffectName,
    type Element,
    EventName,
    Location,
    Players
} from './Constants.js';
import { ElementSymbol, type ElementSymbolInfo } from './ElementSymbol.js';
import {
    ActionProps,
    AttachmentConditionProps,
    PersistentEffectProps,
    TriggeredAbilityProps
} from './Interfaces.js';
import type { GameObject } from './GameObject.js';
import { StatusToken } from './StatusToken.js';
import Player from './Player.js';
import type BaseAction from './BaseAction.js';
import Ring from './Ring.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Effect from './Effects/Effect.js';
import type { EffectFactory } from './Effects/EffectBuilder.js';
import type { GainAllAbilities } from './Effects/Library/gainAllAbilities.js';
import type { EffectValue } from './Effects/EffectValue.js';
import type { CardData } from './types/CardData.js';
import { type PrintedKeyword, parseKeywords as parseKeywordsFromText } from './KeywordParser.js';

export type Faction = 'neutral' | 'crab' | 'crane' | 'dragon' | 'lion' | 'phoenix' | 'scorpion' | 'unicorn' | 'shadowlands';

export interface StoredPersistentEffect {
    duration: Duration;
    location: Location | Location[];
    condition?: (context: AbilityContext) => boolean;
    match?: (card: GameObject, context?: AbilityContext) => boolean;
    targetController?: Players;
    targetLocation?: Location | (string & {});
    effect: EffectFactory | EffectFactory[];
    createCopies?: boolean;
    ref?: Effect[];
    type?: EffectName;
    abilityType?: AbilityType;
    isKeywordEffect?: boolean;
}

interface ProvidedAbilities {
    getActions(target: GameObject): CardAction[];
    getReactions(target: GameObject): TriggeredAbility[];
    getPersistentEffects(): StoredPersistentEffect[];
}

interface DynamicallyProvidedAbilities extends ProvidedAbilities {
    calculate(target: GameObject, context: AbilityContext): unknown;
}

interface CardAbilities {
    actions: CardAction[];
    reactions: TriggeredAbility[];
    persistentEffects: StoredPersistentEffect[];
    playActions: BaseAction[];
}

const TRIGGERED_ABILITY_TYPES = new Set<AbilityType>([
    AbilityType.ForcedInterrupt,
    AbilityType.ForcedReaction,
    AbilityType.Interrupt,
    AbilityType.Reaction,
    AbilityType.WouldInterrupt
]);

const FACEUP_LOCATIONS = new Set([Location.PlayArea, Location.ConflictDiscardPile, Location.DynastyDiscardPile, Location.Hand]);

const PLAYABLE_OUT_OF_PLAY_LOCATIONS: Set<Location> = new Set([
    Location.RemovedFromGame,
    Location.ConflictDiscardPile,
    Location.DynastyDiscardPile,
    Location.UnderneathStronghold
]);

export interface CardSummary {
    attachments?: CardSummary[];
    childCards?: CardSummary[];
    [key: string]: unknown;
}

class BaseCard extends EffectSource {
    controller: Player;
    declare game: Game;

    declare id: string;
    printedName: string;
    inConflict = false;
    facedown: boolean = false;
    bowed = false;

    tokens: Record<string, number> = {};
    menu: { command: string; text: string }[] = [];

    showPopup: boolean = false;
    popupMenuText: string = '';
    abilities: CardAbilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
    traits: string[];
    printedFaction: string;
    location!: Location;

    isProvince: boolean = false;
    isConflict: boolean = false;
    isDynasty: boolean = false;
    isStronghold: boolean = false;
    packId: string | undefined;

    protected statusManager!: CardStatusManager;
    allowedAttachmentTraits: string[] = [];
    readonly #pendingAbilities: Array<() => void> = [];
    #settingUp = false;
    protected attachmentHost = new AttachmentManager(this);
    printedKeywords: Array<PrintedKeyword> = [];
    disguisedKeywordTraits: string[] = [];

    /** What this card is attached to, or null — the inverse of `attachments`. */
    parent: BaseCard | Ring | null = null;

    /** The attached character, in the cards' sense; null when attached to anything else. */
    get parentCharacter(): DrawCard | null {
        return this.parent instanceof BaseCard && this.parent.isCharacter() ? this.parent : null;
    }

    /** The attached province, in the cards' sense; null when attached to anything else. */
    get parentProvince(): ProvinceCard | null {
        return this.parent instanceof BaseCard && this.parent.isProvinceCard() ? this.parent : null;
    }

    get attachments(): DrawCard[] {
        return this.attachmentHost.attachments;
    }

    set attachments(value: DrawCard[]) {
        this.attachmentHost.attachments = value;
    }

    removeAttachment(attachment: DrawCard): void {
        this.attachmentHost.remove(attachment);
    }

    constructor(
        public owner: Player,
        public cardData: CardData
    ) {
        super(owner.game);
        this.statusManager = new CardStatusManager(this);
        this.controller = owner;

        this.id = cardData.id;
        this.printedName = cardData.name;
        this.printedType = cardData.type;
        this.traits = cardData.traits || [];
        this.printedFaction = cardData.clan ?? cardData.faction ?? '';

        this.#settingUp = true;
        this.setupCardAbilities(AbilityDsl);
        this.#settingUp = false;
        for(const register of this.#pendingAbilities.splice(0)) {
            register();
        }
        this.parseKeywords(cardData.text ? cardData.text.replace(/<[^>]*>/g, '').toLowerCase() : '');
    }

    get copiedCard(): BaseCard | undefined {
        return this.mostRecentEffect(EffectName.CopyCharacter) || this.mostRecentEffect(EffectName.CopyProvince) || undefined;
    }

    get name(): string {
        return this.copiedCard?.printedName ?? this.printedName;
    }

    set name(name: string) {
        this.printedName = name;
    }

    get type(): CardType {
        return this.getType() as CardType;
    }

    private copiedAbilities(): ProvidedAbilities | undefined {
        const effects = this.getRawEffects();
        const copyEffect =
            effects.filter((effect) => effect.type === EffectName.CopyCharacter).at(-1) ??
            effects.filter((effect) => effect.type === EffectName.CopyProvince).at(-1);
        return copyEffect?.value as ProvidedAbilities | undefined;
    }

    /** Static gains first, then dynamic ones, recalculated. */
    private gainedFromAllAbilities<T>(abilitiesOf: (value: ProvidedAbilities) => T[], ignoreDynamicGains: boolean): T[] {
        let gained: T[] = [];
        for(const effect of this.getRawEffects()) {
            if(effect.type === EffectName.GainAllAbilities) {
                gained = gained.concat(abilitiesOf(effect.value as GainAllAbilities));
            }
        }
        if(ignoreDynamicGains || !this.anyEffect(EffectName.GainAllAbilitiesDynamic)) {
            return gained;
        }
        const context = this.game.getFrameworkContext(this.controller);
        for(const effect of this.getRawEffects().filter((effect) => effect.type === EffectName.GainAllAbilitiesDynamic)) {
            const value = effect.value as DynamicallyProvidedAbilities;
            value.calculate(this, context);
            gained = gained.concat(abilitiesOf(value));
        }
        return gained;
    }

    _getActions(ignoreDynamicGains = false): CardAction[] {
        const copied = this.copiedAbilities();
        const gainedActions = (this.getEffects(EffectName.GainAbility) as CardAction[]).filter(
            (ability) => ability.abilityType === AbilityType.Action
        );
        const actions = (copied ? copied.getActions(this) : this.abilities.actions).concat(
            this.gainedFromAllAbilities((value) => value.getActions(this), ignoreDynamicGains),
            gainedActions
        );
        return this.anyEffect(EffectName.LoseAllNonKeywordAbilities) ? actions.filter((a) => a.isKeywordAbility()) : actions;
    }

    get actions(): CardAction[] {
        return this._getActions();
    }

    _getReactions(ignoreDynamicGains = false): TriggeredAbility[] {
        const copied = this.copiedAbilities();
        const gainedReactions = (this.getEffects(EffectName.GainAbility) as TriggeredAbility[]).filter((ability) =>
            TRIGGERED_ABILITY_TYPES.has(ability.abilityType)
        );
        const reactions = (copied ? copied.getReactions(this) : this.abilities.reactions).concat(
            this.gainedFromAllAbilities((value) => value.getReactions(this), ignoreDynamicGains),
            gainedReactions
        );
        return this.anyEffect(EffectName.LoseAllNonKeywordAbilities) ? reactions.filter((a) => a.isKeywordAbility()) : reactions;
    }

    get reactions(): TriggeredAbility[] {
        return this._getReactions();
    }

    _getPersistentEffects(ignoreDynamicGains = false): StoredPersistentEffect[] {
        const gainedEffects = (this.getEffects(EffectName.GainAbility) as StoredPersistentEffect[]).filter(
            (ability) => ability.abilityType === AbilityType.Persistent
        );
        const copied = this.copiedAbilities();
        if(copied) {
            return gainedEffects.concat(copied.getPersistentEffects());
        }
        // Dynamic gains hand out no persistent effects, but recalculating them here, while the game
        // state applies effects, is what picks up their reactions and interrupts.
        const gained = gainedEffects.concat(
            this.gainedFromAllAbilities((value) => value.getPersistentEffects(), ignoreDynamicGains)
        );
        if(this.anyEffect(EffectName.LoseAllNonKeywordAbilities)) {
            return this.abilities.persistentEffects
                .concat(gained)
                .filter((a) => a.isKeywordEffect || a.type === EffectName.AddKeyword);
        }
        return this.isBlank() ? gained : this.abilities.persistentEffects.concat(gained);
    }

    get persistentEffects(): StoredPersistentEffect[] {
        return this._getPersistentEffects();
    }

    setupCardAbilities(_ability: typeof AbilityDsl): void {}

    action<Target extends BaseCard = BaseCard>(properties: ActionProps<this, Target>): void;
    action(title: string): AbilityBuilder<ActionContext<this>>;
    action<Target extends BaseCard = BaseCard>(properties: ActionProps<this, Target> | string): void | AbilityBuilder<ActionContext<this>> {
        if(typeof properties === 'string') {
            this.requireSetup(properties);
            const draft = createDraft(properties, (context) => context.ability instanceof CardAction);
            this.registerAbility(() => this.action(actionProperties<this>(draft)));
            return new AbilityBuilder(draft);
        }
        this.registerAbility(() => this.abilities.actions.push(this.createAction(properties as ActionProps)));
    }

    /** A builder is registered when `setupCardAbilities` returns, so it can only be started there. */
    private requireSetup(title: string): void {
        if(!this.#settingUp) {
            throw new Error(`${title}: abilities built with a title can only be declared in setupCardAbilities`);
        }
    }

    /** Queues a registration while `setupCardAbilities` runs, so builder and object abilities keep their order. */
    protected registerAbility(register: () => void): void {
        if(this.#settingUp) {
            this.#pendingAbilities.push(register);
        } else {
            register();
        }
    }

    protected triggerBuilder<EventOptional extends boolean = false>(abilityType: AbilityType, title: string): TriggerBuilder<this, EventOptional> {
        this.requireSetup(title);
        return new TriggerBuilder<this, EventOptional>((when) => {
            const draft = createDraft(title, holdsTriggerEvent(when, () => this.isProvinceCard()));
            this.registerAbility(() => this.triggeredAbility(abilityType, triggeredProperties<this>(draft, when)));
            return draft;
        });
    }

    createAction(properties: ActionProps): CardAction {
        return new CardAction(this, properties);
    }

    triggeredAbility<Target extends BaseCard = BaseCard>(abilityType: AbilityType, properties: TriggeredAbilityProps<this, Target>): void {
        this.registerAbility(() => this.abilities.reactions.push(this.createTriggeredAbility(abilityType, properties)));
    }

    createTriggeredAbility<Target extends BaseCard = BaseCard>(abilityType: AbilityType, properties: TriggeredAbilityProps<this, Target>): TriggeredAbility {
        // The author DSL props carry the target generic; the runtime ability erases it (Target is
        // covariant in the handler context), so downcast once to drop it.
        return new TriggeredAbility(this, abilityType, properties as TriggeredAbilityProperties<this>);
    }

    private declareTriggeredAbility<Target extends BaseCard>(abilityType: AbilityType, properties: TriggeredAbilityProps<this, Target> | string): void | TriggerBuilder<this, boolean> {
        if(typeof properties === 'string') {
            return this.triggerBuilder<boolean>(abilityType, properties);
        }
        this.triggeredAbility(abilityType, properties);
    }

    reaction<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void;
    reaction(this: ProvinceCard, title: string): TriggerBuilder<this, true>;
    reaction(title: string): TriggerBuilder<this>;
    reaction<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target> | string): void | TriggerBuilder<this, boolean> {
        return this.declareTriggeredAbility(AbilityType.Reaction, properties);
    }

    forcedReaction<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void;
    forcedReaction(this: ProvinceCard, title: string): TriggerBuilder<this, true>;
    forcedReaction(title: string): TriggerBuilder<this>;
    forcedReaction<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target> | string): void | TriggerBuilder<this, boolean> {
        return this.declareTriggeredAbility(AbilityType.ForcedReaction, properties);
    }

    wouldInterrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void;
    wouldInterrupt(this: ProvinceCard, title: string): TriggerBuilder<this, true>;
    wouldInterrupt(title: string): TriggerBuilder<this>;
    wouldInterrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target> | string): void | TriggerBuilder<this, boolean> {
        return this.declareTriggeredAbility(AbilityType.WouldInterrupt, properties);
    }

    interrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void;
    interrupt(this: ProvinceCard, title: string): TriggerBuilder<this, true>;
    interrupt(title: string): TriggerBuilder<this>;
    interrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target> | string): void | TriggerBuilder<this, boolean> {
        return this.declareTriggeredAbility(AbilityType.Interrupt, properties);
    }

    forcedInterrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void;
    forcedInterrupt(this: ProvinceCard, title: string): TriggerBuilder<this, true>;
    forcedInterrupt(title: string): TriggerBuilder<this>;
    forcedInterrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target> | string): void | TriggerBuilder<this, boolean> {
        return this.declareTriggeredAbility(AbilityType.ForcedInterrupt, properties);
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect<T extends GameObject = GameObject>(properties: PersistentEffectProps<this, T>): void {
        const allowedLocations = [
            Location.Any,
            Location.ConflictDiscardPile,
            Location.PlayArea,
            Location.Provinces
        ];
        const defaultLocationForType: Record<string, Location> = {
            province: Location.Provinces,
            holding: Location.Provinces,
            stronghold: Location.Provinces
        };

        const locationProp = properties.location || defaultLocationForType[this.getType()] || Location.PlayArea;
        const location = Array.isArray(locationProp) ? locationProp[0] : locationProp;
        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }
        this.abilities.persistentEffects.push({ duration: Duration.Persistent, location, ...properties } as StoredPersistentEffect);
    }

    attachmentConditions(properties: AttachmentConditionProps): void {
        const effects = [];
        if(properties.limit) {
            effects.push(Effects.attachmentLimit(properties.limit));
        }
        if(properties.myControl) {
            effects.push(Effects.attachmentMyControlOnly());
        }
        if(properties.opponentControlOnly) {
            effects.push(Effects.attachmentOpponentControlOnly());
        }
        if(properties.unique) {
            effects.push(Effects.attachmentUniqueRestriction());
        }
        if(properties.faction) {
            effects.push(Effects.attachmentFactionRestriction([properties.faction].flat()));
        }
        if(properties.trait) {
            effects.push(Effects.attachmentTraitRestriction([properties.trait].flat()));
        }
        if(properties.limitTrait) {
            for(const traitLimit of [properties.limitTrait].flat()) {
                const trait = Object.keys(traitLimit)[0];
                effects.push(Effects.attachmentRestrictTraitAmount({ [trait]: traitLimit[trait] }));
            }
        }
        if(properties.cardCondition) {
            effects.push(Effects.attachmentCardCondition(properties.cardCondition));
        }
        if(effects.length > 0) {
            this.persistentEffect({
                location: Location.Any,
                effect: effects
            });
        }
    }

    composure(properties: Omit<PersistentEffectProps<this>, 'condition'>): void {
        this.persistentEffect({
            condition: (context: AbilityContext<this>) => context.player.hasComposure(),
            ...properties
        });
    }

    dire<T extends GameObject = GameObject>(properties: PersistentEffectProps<this, T>): void {
        const condition = properties.condition;
        this.persistentEffect({
            isKeywordEffect: true,
            ...properties,
            condition: (context: AbilityContext<this>) => context.source.isDire() && (!condition || condition(context))
        });
    }

    legendary(fate: number): void {
        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: [
                AbilityDsl.effects.playerCannot({
                    cannot: 'placeFateWhenPlayingCharacterFromProvince',
                    restricts: 'source'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'putIntoPlay',
                    restricts: 'cardEffects'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'placeFate'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'preventedFromLeavingPlay'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'enterPlay',
                    restricts: 'nonDynastyPhase'
                }),
                AbilityDsl.effects.legendaryFate(fate)
            ]
        });
    }

    isDire(): boolean {
        return false;
    }

    hasKeyword(keyword: string): boolean {
        const targetKeyword = keyword.toLowerCase();
        const added = this.getEffects(EffectName.AddKeyword).filter((value: string) => value === targetKeyword).length;
        const lost = this.getEffects(EffectName.LoseKeyword).filter((value: string) => value === targetKeyword).length;
        return added > lost;
    }

    hasPrintedKeyword(keyword: PrintedKeyword) {
        return this.printedKeywords.includes(keyword);
    }

    hasTrait(trait: string): boolean {
        return this.hasSomeTrait(trait);
    }

    hasEveryTrait(traits: Set<string>): boolean;
    hasEveryTrait(...traits: string[]): boolean;
    hasEveryTrait(traitSetOrFirstTrait: Set<string> | string, ...otherTraits: string[]): boolean {
        const cardTraits = this.getTraitSet();
        return [...traitsToCheck(traitSetOrFirstTrait, otherTraits)].every((trait) => cardTraits.has(trait.toLowerCase()));
    }

    hasSomeTrait(traits: Set<string>): boolean;
    hasSomeTrait(...traits: string[]): boolean;
    hasSomeTrait(traitSetOrFirstTrait: Set<string> | string, ...otherTraits: string[]): boolean {
        const cardTraits = this.getTraitSet();
        return [...traitsToCheck(traitSetOrFirstTrait, otherTraits)].some((trait) => cardTraits.has(trait.toLowerCase()));
    }

    getTraits(): Set<string> {
        return this.getTraitSet();
    }

    getTraitSet(): Set<string> {
        const set = new Set(this.printedTraits());

        for(const gainedTrait of this.getEffects(EffectName.AddTrait)) {
            set.add(gainedTrait);
        }
        for(const lostTrait of this.getEffects(EffectName.LoseTrait)) {
            set.delete(lostTrait);
        }

        return set;
    }

    private printedTraits(): string[] {
        const copiedCard = this.copiedCard;
        if(copiedCard) {
            return copiedCard.traits;
        }
        const traitsBlanked = this.getEffects(EffectName.Blank).some((blankTraits: boolean) => blankTraits);
        return traitsBlanked ? [] : this.traits;
    }

    isFaction(faction: Faction): boolean {
        const cardFactions = this.getFactions();
        if(faction === 'neutral') {
            return cardFactions.has(faction) && cardFactions.size === 1;
        }
        return cardFactions.has(faction);
    }

    getFactions(): Set<Faction> {
        const copiedCard = this.copiedCard;
        const cardFaction = (copiedCard ? copiedCard.printedFaction : this.printedFaction) as Faction;
        const addedFactions = this.getEffects(EffectName.AddFaction) as Faction[];
        const lostFactions = this.getEffects(EffectName.LoseFaction) as Faction[];
        const factionArray = [...addedFactions, cardFaction].filter(faction => !lostFactions.includes(faction));

        return new Set(factionArray);
    }

    /** Narrows to `DrawCard`: an attachment may be attached to a province or a ring instead. */
    isCharacter(): this is DrawCard {
        return this.type === CardType.Character;
    }

    /** Narrows to `DrawCard`; `DrawCard` overrides this to return true. */
    isDrawCard(): this is DrawCard {
        return false;
    }

    /** Narrows to `ProvinceCard`, the counterpart of `isCharacter`. */
    isProvinceCard(): this is ProvinceCard {
        return this.isProvince;
    }

    isInProvince(): boolean {
        return this.game.getProvinceArray().includes(this.location);
    }

    isInPlay(): boolean {
        if(this.isFacedown()) {
            return false;
        }
        if([CardType.Holding, CardType.Province, CardType.Stronghold].includes(this.type)) {
            return this.isInProvince();
        }
        return this.location === Location.PlayArea;
    }

    applyAnyLocationPersistentEffects(): void {
        for(const effect of this.persistentEffects) {
            if(effect.location === Location.Any) {
                effect.ref = this.addEffectToEngine({ ...effect, location: effect.location });
            }
        }
    }

    leavesPlay(_destination?: string): void {
        this.tokens = {};
        this.#resetLimits();
        this.controller = this.owner;
        this.inConflict = false;
    }

    #resetLimits() {
        for(const action of this.abilities.actions) {
            action.limit.reset();
        }
        for(const reaction of this.abilities.reactions) {
            reaction.limit.reset();
        }
    }

    updateAbilityEvents(from: Location, to: Location, reset: boolean = true) {
        if(reset) {
            this.#resetLimits();
        }
        for(const reaction of this.reactions) {
            if(this.type === CardType.Event) {
                if(
                    to === Location.ConflictDeck ||
                    this.controller.isCardInPlayableLocation(this) ||
                    (this.controller.opponent && this.controller.opponent.isCardInPlayableLocation(this))
                ) {
                    reaction.registerEvents();
                } else {
                    reaction.unregisterEvents();
                }
            } else if(reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        }
    }

    updateEffects(from: Location, to: Location) {
        const provinces = this.game.getProvinceArray();
        const activeLocations: Record<string, Location[]> = {
            [Location.ConflictDiscardPile]: [Location.ConflictDiscardPile],
            [Location.PlayArea]: [Location.PlayArea],
            [Location.Provinces]: provinces
        };
        if(!provinces.includes(from) || !provinces.includes(to)) {
            this.removeLastingEffects();
        }
        this.updateStatusTokenEffects();
        for(const effect of this.persistentEffects) {
            if(effect.location === Location.Any) {
                continue;
            }
            const location = effect.location as Location;
            const locations = activeLocations[location];
            if(!locations) {
                continue;
            }
            const wasActive = locations.includes(from);
            const isActive = locations.includes(to);
            if(isActive && !wasActive) {
                effect.ref = this.addEffectToEngine({ ...effect, location });
            } else if(wasActive && !isActive) {
                if(effect.ref) {
                    this.removeEffectFromEngine(effect.ref);
                }
                effect.ref = [];
            }
        }
    }

    updateEffectContexts() {
        for(const effect of this.persistentEffects) {
            for(const engineEffect of effect.ref ?? []) {
                engineEffect.refreshContext();
            }
        }
    }

    moveTo(targetLocation: Location) {
        const originalLocation = this.location;
        this.location = targetLocation;

        if(FACEUP_LOCATIONS.has(targetLocation)) {
            this.facedown = false;
        }
        if(originalLocation === targetLocation) {
            return;
        }

        const provinces = this.game.getProvinceArray();
        const betweenProvinces = provinces.includes(originalLocation) && provinces.includes(targetLocation);
        this.updateAbilityEvents(originalLocation, targetLocation, !betweenProvinces);
        this.updateEffects(originalLocation, targetLocation);
        this.game.emitEvent(EventName.OnCardMoved, { card: this, originalLocation, newLocation: targetLocation });
    }

    canTriggerAbilities(context: AbilityContext, ignoredRequirements: string[] = []): boolean {
        return (
            this.isFaceup() &&
            (ignoredRequirements.includes('triggeringRestrictions') ||
                this.checkRestrictions('triggerAbilities', context))
        );
    }

    canInitiateKeywords(context: AbilityContext): boolean {
        return this.isFaceup() && this.checkRestrictions('initiateKeywords', context);
    }

    getModifiedLimitMax(player: Player, ability: CardAbility, max: number): number {
        let total = max;
        for(const effect of this.getRawEffects().filter((effect) => effect.type === EffectName.IncreaseLimitOnAbilities)) {
            const { applyingPlayer, targetAbility } = effect.getValue<{ applyingPlayer?: Player; targetAbility?: CardAbility }>(this);
            if((!targetAbility || targetAbility === ability) && (applyingPlayer || effect.context.player) === player) {
                total++;
            }
        }
        for(const effect of this.getRawEffects().filter((effect) => effect.type === EffectName.IncreaseLimitOnPrintedAbilities)) {
            const value = effect.getValue(this);
            if(ability.printedAbility && (value === true || value === ability) && effect.context.player === player) {
                total++;
            }
        }
        return total;
    }

    getMenu() {
        if(
            this.menu.length === 0 ||
            !this.game.manualMode ||
            ![...this.game.getProvinceArray(), Location.PlayArea].includes(this.location)
        ) {
            return undefined;
        }

        if(this.isFacedown()) {
            return [
                { command: 'click', text: 'Select Card' },
                { command: 'reveal', text: 'Reveal' }
            ];
        }

        const menu = [{ command: 'click', text: 'Select Card' }];
        if(this.location === Location.PlayArea || this.isProvince || this.isStronghold) {
            menu.push(...this.menu);
        }
        return menu;
    }

    isConflictProvince(): boolean {
        return false;
    }

    isInConflictProvince(): boolean {
        return false;
    }

    isInConflict(): boolean {
        return this.inConflict;
    }

    isAtHome(): boolean {
        return !this.inConflict;
    }

    bow(): void {
        this.bowed = true;
    }

    ready(): void {
        this.bowed = false;
    }

    isUnique(): boolean {
        return !!this.cardData.is_unique;
    }

    isBlank(): boolean {
        return this.anyEffect(EffectName.Blank) || this.anyEffect(EffectName.CopyCharacter) || this.anyEffect(EffectName.CopyProvince);
    }

    getPrintedFaction(): string {
        return this.cardData.clan ?? this.cardData.faction ?? '';
    }

    checkRestrictions(actionType: string, context: AbilityContext): boolean {
        const player = context?.player || this.controller;
        const conflict = context?.game?.currentConflict;
        return (
            super.checkRestrictions(actionType, context) &&
            player.checkRestrictions(actionType, context) &&
            (!conflict || conflict.checkRestrictions(actionType, context))
        );
    }

    getTokenCount(type: string): number {
        return this.tokens[type] ?? 0;
    }

    addToken(type: string, number: number = 1): void {
        this.tokens[type] = this.getTokenCount(type) + number;
    }

    hasToken(type: string): boolean {
        return this.getTokenCount(type) > 0;
    }

    removeAllTokens(): void {
        for(const [type, count] of Object.entries(this.tokens)) {
            this.removeToken(type, count);
        }
    }

    removeToken(type: string, number: number): void {
        this.tokens[type] = Math.max(this.tokens[type] - number, 0);
        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    getActions(): BaseCardAbility[] {
        return this.actions.slice();
    }

    getReactions(): TriggeredAbility[] {
        return this.reactions.slice();
    }

    getProvinceStrengthBonus(): number {
        return 0;
    }

    getFate(): number {
        return 0;
    }

    readiesDuringReadyPhase(): boolean {
        return !this.anyEffect(EffectName.DoesNotReady);
    }

    hideWhenFacedown(): boolean {
        return !this.anyEffect(EffectName.CanBeSeenWhenFacedown);
    }

    createSnapshot() {
        return {};
    }

    parseKeywords(text: string) {
        const parsed = parseKeywordsFromText(text);
        this.printedKeywords = parsed.keywords;
        this.disguisedKeywordTraits = parsed.disguisedTraits;
        this.allowedAttachmentTraits = parsed.allowedAttachmentTraits;

        for(const keyword of this.printedKeywords) {
            this.persistentEffect({ effect: AbilityDsl.effects.addKeyword(keyword) });
        }
    }

    checkForIllegalAttachments(): boolean {
        return false;
    }

    checkForIllegalTokens(): boolean {
        return false;
    }

    mustAttachToRing() {
        return false;
    }

    /**
     * Checks whether an attachment can be played on a given card or ring.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(_card: BaseCard | Ring): boolean {
        return true;
    }

    /**
     * Checks 'no attachment' restrictions for this card when attempting to
     * attach the passed attachment card.
     */
    allowAttachment(attachment: BaseCard): boolean {
        if(this.allowedAttachmentTraits.some((trait) => attachment.hasTrait(trait))) {
            return true;
        }

        return this.isBlank() || this.allowedAttachmentTraits.length === 0;
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     *
     * `Ring` is in the signature only so `AttachToRingAction.canAffect` can call
     * `attachment.canAttach(ring)` without a cast — the base impl rejects rings.
     * Ring-attaching cards (e.g. `GreaterUnderstanding`) override this and pair
     * with `mustAttachToRing()`.
     */
    canAttach(parent?: BaseCard | Ring, properties = { ignoreType: false, controller: this.controller }) {
        if(!(parent instanceof BaseCard)) {
            return false;
        }

        if(
            parent.getType() !== CardType.Character ||
            (!properties.ignoreType && this.getType() !== CardType.Attachment)
        ) {
            return false;
        }

        const attachmentController = properties.controller ?? this.controller;
        for(const effect of this.getRawEffects()) {
            switch(effect.type) {
                case EffectName.AttachmentMyControlOnly: {
                    if(attachmentController !== parent.controller) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentOpponentControlOnly: {
                    if(attachmentController === parent.controller) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentUniqueRestriction: {
                    if(!parent.isUnique()) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentFactionRestriction: {
                    const factions = effect.getValue<Faction[]>(this);
                    if(!factions.some((faction) => parent.isFaction(faction))) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentTraitRestriction: {
                    const traits = effect.getValue<string[]>(this);
                    if(!traits.some((trait) => parent.hasTrait(trait))) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentCardCondition: {
                    const cardCondition = effect.getValue<(card: BaseCard) => boolean>(this);
                    if(!cardCondition(parent)) {
                        return false;
                    }
                    break;
                }
            }
        }
        return true;
    }


    get statusTokens(): StatusToken[] {
        return this.statusManager.statusTokens;
    }

    addStatusToken(tokenType: CharacterStatus | StatusToken) {
        this.statusManager.addStatusToken(tokenType);
    }
    removeStatusToken(tokenType: CharacterStatus | StatusToken) {
        this.statusManager.removeStatusToken(tokenType);
    }
    getStatusToken(tokenType: CharacterStatus) {
        return this.statusManager.getStatusToken(tokenType);
    }
    updateStatusTokenEffects() {
        this.statusManager.updateStatusTokenEffects();
    }
    get hasStatusTokens() {
        return this.statusManager.hasStatusTokens;
    }
    hasStatusToken(type: CharacterStatus) {
        return this.statusManager.hasStatusToken(type);
    }
    get isHonored() {
        return this.statusManager.isHonored;
    }
    honor() {
        this.statusManager.honor();
    }
    get isDishonored() {
        return this.statusManager.isDishonored;
    }
    dishonor() {
        this.statusManager.dishonor();
    }
    get isTainted() {
        return this.statusManager.isTainted;
    }
    taint() {
        this.statusManager.taint();
    }
    untaint() {
        this.statusManager.untaint();
    }
    makeOrdinary() {
        this.statusManager.makeOrdinary();
    }
    isOrdinary() {
        return this.statusManager.isOrdinary();
    }

    hasElementSymbols(): boolean {
        return false;
    }

    getPrintedElementSymbols(): ElementSymbolInfo[] {
        return [];
    }

    getCurrentElementSymbols(): ElementSymbol[] {
        const symbols = this.getPrintedElementSymbols();
        if(this.isInPlay()) {
            for(const effect of this.getRawEffects().filter((effect) => effect.type === EffectName.ReplacePrintedElement)) {
                const newElement = (effect.value as EffectValue<ElementSymbolInfo>).value;
                const symbol = symbols.find((a) => a.key === newElement.key);
                if(symbol) {
                    symbol.element = newElement.element;
                }
            }
        }
        return symbols.map((symbol) => new ElementSymbol(this.game, this, symbol));
    }

    getCurrentElementSymbol(key: string): Element {
        const symbol = this.getCurrentElementSymbols().find((a) => a.key === key);
        if(!symbol) {
            throw new Error(`${this.name} has no element symbol '${key}'`);
        }
        return symbol.element;
    }

    public getShortSummary() {
        return {
            ...super.getShortSummary(),
            packId: this.packId
        };
    }

    public getShortSummaryForControls(activePlayer: Player) {
        if(this.isFacedown() && (activePlayer !== this.controller || this.hideWhenFacedown())) {
            return { facedown: true, isDynasty: this.isDynasty, isConflict: this.isConflict };
        }
        return super.getShortSummaryForControls(activePlayer);
    }

    private getAbilityLimitSummary(): Array<{ max: number; current: number; exhausted: boolean }> | undefined {
        if(!this.controller) {
            return undefined;
        }
        const seen = new Set();
        const limits: Array<{ max: number; current: number; exhausted: boolean }> = [];
        const gainedAbilities = this.getEffects(EffectName.GainAbility) as CardAction[];
        for(const ability of [...this.abilities.actions, ...this.abilities.reactions, ...gainedAbilities]) {
            const limit = ability.limit;
            if(!limit || seen.has(limit)) {
                continue;
            }
            seen.add(limit);
            if(limit.max !== undefined && isFinite(limit.max)) {
                const current = limit.currentForPlayer(this.controller);
                if(current > 0) {
                    limits.push({ max: limit.max, current, exhausted: limit.isAtMax(this.controller) });
                }
            }
        }
        return limits.length > 0 ? limits : undefined;
    }

    /**
     * Names of the players who can currently play this card from where it sits. Only meaningful
     * out of play — e.g. cards set aside by Favorable Alliance or stolen by Shachihoko Bay stay
     * in "removed from game" but remain playable for a while, and the client marks those.
     */
    getPlayableBy(): string[] | undefined {
        if(!PLAYABLE_OUT_OF_PLAY_LOCATIONS.has(this.location)) {
            return undefined;
        }

        const names = this.game
            .getPlayers()
            .filter((player) => player.isCardInPlayableLocation(this))
            .map((player) => player.name);

        return names.length > 0 ? names : undefined;
    }

    getSummary(activePlayer: Player, hideWhenFaceup: boolean): CardSummary {
        const isActivePlayer = activePlayer === this.controller;
        const selectionState = activePlayer.getCardSelectionState(this);

        // This is my facedown card, but I'm not allowed to look at it
        // OR This is not my card, and it's either facedown or hidden from me
        if(
            isActivePlayer
                ? this.isFacedown() && this.hideWhenFacedown()
                : this.isFacedown() || hideWhenFaceup || this.anyEffect(EffectName.HideWhenFaceUp)
        ) {
            const state = {
                controller: this.controller.getShortSummary(),
                menu: isActivePlayer ? this.getMenu() : undefined,
                facedown: true,
                inConflict: this.inConflict,
                location: this.location,
                uuid: isActivePlayer ? this.uuid : undefined
            };
            return Object.assign(state, selectionState);
        }

        const state = {
            id: this.cardData.id,
            controlled: this.owner !== this.controller,
            inConflict: this.inConflict,
            facedown: this.isFacedown(),
            location: this.location,
            menu: this.getMenu(),
            name: this.cardData.name,
            packId: this.packId,
            popupMenuText: this.popupMenuText,
            showPopup: this.showPopup,
            tokens: this.tokens,
            type: this.getType(),
            isDishonored: this.isDishonored,
            isHonored: this.isHonored,
            isTainted: !!this.isTainted,
            uuid: this.uuid,
            abilityLimits: this.getAbilityLimitSummary(),
            playableBy: this.getPlayableBy()
        };

        return Object.assign(state, selectionState);
    }
}

function traitsToCheck(traitSetOrFirstTrait: Set<string> | string, otherTraits: string[]): Set<string> {
    return traitSetOrFirstTrait instanceof Set ? traitSetOrFirstTrait : new Set([traitSetOrFirstTrait, ...otherTraits]);
}

export default BaseCard;
