import type { SelectChoice } from './AbilityTargets/SelectChoice.js';
import { BaseAbility } from './BaseAbility.js';
import type BaseCard from './BaseCard.js';
import type { CardAbility } from './CardAbility.js';
import type DrawCard from './DrawCard.js';
import { type Location, type PlayType, Stage } from './Constants.js';
import { EffectSource } from './EffectSource.js';
import type { ElementSymbol } from './ElementSymbol.js';
import type { Event } from './Events/Event.js';
import type Game from './Game.js';
import type { GameAction } from './GameActions/GameAction.js';
import type Player from './Player.js';
import type Ring from './Ring.js';
import type { StatusToken } from './StatusToken.js';

export interface AbilityContextProperties {
    game: Game;
    source?: EffectSource;
    player: Player;
    ability?: BaseAbility;
    costs?: Record<string, unknown>;
    targets?: Record<string, BaseCard | BaseCard[]>;
    rings?: Record<string, Ring | Ring[]>;
    selects?: Record<string, SelectChoice>;
    tokens?: Record<string, StatusToken[]>;
    elements?: Record<string, ElementSymbol>;
    stage?: Stage;
    targetAbility?: CardAbility;
}

export class AbilityContext<Source extends EffectSource = BaseCard, Target extends BaseCard = BaseCard> {
    game: Game;
    source: Source;
    player: Player;
    ability: BaseAbility;
    // Bags are dynamically keyed by per-ability target/cost names; values typed to
    // the union their resolvers produce. cost results are open-ended per cost type
    // (card/array/ring/number/boolean/string), so values are unknown — narrow at read.
    costs: Record<string, unknown>;
    targets: Record<string, BaseCard | BaseCard[]>;
    rings: Record<string, Ring | Ring[]>;
    selects: Record<string, SelectChoice>;
    tokens: Record<string, StatusToken[]>;
    elements: Record<string, ElementSymbol>;
    deckSearchSelected: DrawCard[] = [];
    events: Event[] = [];
    /** In a `then` step that inherits targets: the events of the step before. */
    previousEvents: Event[] = [];
    stage: Stage;
    targetAbility: CardAbility | undefined;
    /** Set by `AbilityTargetCard` when one card is chosen for a target named `'target'`; several cards stay in `targets.target`. */
    target: Target | undefined;
    select: string | undefined;
    ring: Ring | undefined;
    token: StatusToken[] | undefined;
    element: ElementSymbol | undefined;
    elementCard: BaseCard | undefined;
    provincesToRefill: { player: Player; location: Location }[] = [];
    subResolution = false;
    /** Set when this context continues an earlier one: a sub-resolution (`resolveAbility`/`triggerAbility`) or a `then` clause. */
    originatingContext?: AbilityContext<EffectSource>;
    /** Every card chosen as a target across this triggering, continuations included. */
    chosenCardTargets: BaseCard[] = [];
    choosingPlayerOverride: Player | null = null;
    /** Set when the ability resolves "as if the conflict were at" this province (Keeper of Secret Names). */
    asIfConflictAt: BaseCard | undefined;
    gameActionsResolutionChain: GameAction[] = [];
    playType: PlayType | undefined;
    cardStateWhenInitiated: BaseCard | null = null;
    /** Extra fate to place on a character being played, chosen by the `chooseFate` cost. */
    chooseFate = 0;
    /** The character a character played with Disguise replaces, once its play cost has chosen it. */
    disguisedCharacter: DrawCard | undefined;
    /** The cards already paid for as "an additional cost to choose … as a target". A following step keeps them. */
    targetingCostPaid: BaseCard[] = [];
    ignoreFateCost?: boolean;
    payFateCostToOpponent?: boolean;
    onPlayCardSource?: BaseCard;


    /** What the ability targets, for messages and prompt arrows: the cards chosen for a target named `target`, else `target`. */
    messageTarget(): Target | BaseCard[] | undefined {
        const chosen = this.targets.target;
        return Array.isArray(chosen) ? chosen : this.target;
    }

    /** What a chat text string's `{0}` names: the target, else the ring, else the source. */
    chatTarget(): Target | BaseCard[] | Ring | Source {
        return this.messageTarget() || this.ring || this.source;
    }
    constructor(properties: AbilityContextProperties) {
        this.game = properties.game;
        // a framework context's source is a plain EffectSource
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- see above
        this.source = (properties.source || new EffectSource(this.game)) as Source;
        this.player = properties.player;
        this.ability = properties.ability || new BaseAbility({});
        this.costs = properties.costs || {};
        this.targets = properties.targets || {};
        this.rings = properties.rings || {};
        this.selects = properties.selects || {};
        this.tokens = properties.tokens || {};
        this.elements = properties.elements || {};
        this.stage = properties.stage || Stage.Effect;
        this.targetAbility = properties.targetAbility;
        const source: EffectSource = this.source;
        this.playType = this.player && source.isCard() ? this.player.findPlayType(source) : undefined;
    }

    /** The context representing the triggering this one belongs to. */
    get triggeringContext(): AbilityContext<EffectSource> {
        return this.originatingContext ?? this;
    }

    copy(newProps: Partial<AbilityContextProperties>): AbilityContext<Source, Target> {
        return this.copyStateTo(this.createCopy(newProps));
    }

    protected copyStateTo<Context extends AbilityContext<Source, Target>>(copy: Context): Context {
        copy.target = this.target;
        copy.token = this.token;
        copy.element = this.element;
        copy.elementCard = this.elementCard;
        copy.select = this.select;
        copy.ring = this.ring;
        copy.provincesToRefill = this.provincesToRefill;
        copy.subResolution = this.subResolution;
        copy.originatingContext = this.originatingContext;
        copy.chosenCardTargets = this.chosenCardTargets;
        copy.choosingPlayerOverride = this.choosingPlayerOverride;
        copy.asIfConflictAt = this.asIfConflictAt;
        copy.gameActionsResolutionChain = this.gameActionsResolutionChain;
        copy.playType = this.playType;
        copy.ignoreFateCost = this.ignoreFateCost;
        copy.previousEvents = this.previousEvents;
        copy.disguisedCharacter = this.disguisedCharacter;
        copy.targetingCostPaid = this.targetingCostPaid;
        return copy;
    }

    createCopy(newProps: Partial<AbilityContextProperties>): AbilityContext<Source, Target> {
        return new AbilityContext<Source, Target>(Object.assign(this.getProps(), newProps));
    }

    refillProvince(player: Player, location: Location): void {
        this.provincesToRefill.push({ player, location });
    }

    refill(): void {
        for(const player of this.game.getPlayersInFirstPlayerOrder()) {
            for(const refill of this.provincesToRefill.filter((refill) => refill.player === player)) {
                this.game.queueSimpleStep(() => {
                    player.replaceDynastyCard(refill.location);
                    return true;
                });
            }
        }
        this.game.queueSimpleStep(() => {
            this.game.checkGameState(true);
        });
    }

    getProps(): AbilityContextProperties {
        return {
            game: this.game,
            source: this.source,
            player: this.player,
            ability: this.ability,
            costs: Object.assign({}, this.costs),
            targets: Object.assign({}, this.targets),
            rings: Object.assign({}, this.rings),
            selects: Object.assign({}, this.selects),
            tokens: Object.assign({}, this.tokens),
            elements: Object.assign({}, this.elements),
            stage: this.stage,
            targetAbility: this.targetAbility
        };
    }
}
