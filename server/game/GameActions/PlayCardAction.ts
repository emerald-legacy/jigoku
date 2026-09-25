import type { AbilityContext } from '../AbilityContext.js';
import type BaseAction from '../BaseAction.js';
import type BaseCard from '../BaseCard.js';
import type BaseCardAbility from '../BaseCardAbility.js';
import { Location, PlayType, Stage, type EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import type Game from '../Game.js';
import AbilityResolver from '../gamesteps/AbilityResolver.js';
import type Player from '../Player.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

class PlayCardResolver extends AbilityResolver {
    playGameAction: PlayCardAction;
    gameActionContext: AbilityContext;
    gameActionProperties: PlayCardProperties;
    cancelPressed: boolean;
    constructor(game: Game, context: AbilityContext, playGameAction: PlayCardAction, gameActionContext: AbilityContext, gameActionProperties: PlayCardProperties) {
        super(game, context);
        this.playGameAction = playGameAction;
        this.gameActionContext = gameActionContext;
        this.gameActionProperties = gameActionProperties;
        this.cancelPressed = false;
        context.ignoreFateCost = this.gameActionProperties.ignoreFateCost;
        context.onPlayCardSource = this.gameActionProperties.source;
        context.payFateCostToOpponent = this.gameActionProperties.payFateToOpponent;
    }

    resolveEarlyTargets() {
        if(this.gameActionProperties.playCardTarget) {
            this.context.stage = Stage.PreTarget;
            this.targetResults = {
                canIgnoreAllCosts: false,
                cancelled: false,
                payCostsFirst: false,
                delayTargeting: null
            };
            this.gameActionProperties.playCardTarget(this.context, this.gameActionProperties);
        } else {
            super.resolveEarlyTargets();
        }
    }

    checkForCancel() {
        super.checkForCancel();
        if(this.cancelled && this.gameActionProperties.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext, this.gameActionProperties);
            this.cancelPressed = true;
        }
    }

    resolveCosts() {
        if(this.gameActionProperties.payCosts) {
            super.resolveCosts();
        }
    }

    payCosts() {
        if(this.gameActionProperties.payCosts) {
            super.payCosts();
        }
        if(this.cancelled && this.gameActionProperties.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext, this.gameActionProperties);
            this.cancelPressed = true;
        }
    }

    moveEventCardToDiscard() {
        if(this.context.source.location === Location.BeingPlayed) {
            const location =
                (this.initiateAbility && this.gameActionProperties.destination) || Location.ConflictDiscardPile;
            if(location === Location.RemovedFromGame) {
                this.game.addMessage(
                    '{0} is removed from the game by {1}\'s effect',
                    this.context.source,
                    this.gameActionContext.source
                );
            }
            if(location === Location.ConflictDeck && this.gameActionProperties.destinationOptions?.bottom) {
                this.game.addMessage(
                    '{0} is placed on the bottom of {1}\'s deck by {2}\'s effect',
                    this.context.source,
                    this.context.player,
                    this.gameActionContext.source
                );
            }
            this.context.player.moveCard(this.context.source, location, this.gameActionProperties.destinationOptions);
        }
    }

    refillProvinces() {
        super.refillProvinces();
        if(!this.cancelPressed) {
            this.game.queueSimpleStep(() => this.gameActionProperties.postHandler?.(this.context));
        }
    }
}

export interface PlayCardProperties extends CardActionProperties {
    resetOnCancel?: boolean;
    postHandler?: (context: AbilityContext) => void;
    playType?: PlayType;
    playCardTarget?: (context: AbilityContext, properties: PlayCardProperties) => void;
    location?: Location;
    destination?: Location;
    destinationOptions?: { bottom?: boolean; [key: string]: unknown };
    payCosts?: boolean;
    ignoreFateCost?: boolean;
    source?: BaseCard;
    allowReactions?: boolean;
    ignoredRequirements?: string[];
    playAction?: BaseAction | BaseAction[];
    payFateToOpponent?: boolean;
    /** The event a reaction is played in response to, when it is played again (Dragon Tattoo). */
    event?: Event;
}

/** A way to play the card, and the context it is played with. */
interface PlayableAbility {
    ability: BaseCardAbility;
    createContext(player: Player): AbilityContext;
}

export class PlayCardAction<C extends AbilityContext = AbilityContext> extends CardGameAction<PlayCardProperties, EventName, C> {
    name = 'playCard';
    effect = 'play {0} as if it were in their hand';
    defaultProperties: PlayCardProperties = {
        resetOnCancel: false,
        postHandler: () => true,
        destinationOptions: {},
        payCosts: true,
        ignoreFateCost: false,
        allowReactions: false,
        ignoredRequirements: [],
        playAction: undefined,
        source: undefined
    };
    constructor(properties: ((context: C) => PlayCardProperties) | PlayCardProperties) {
        super(properties);
    }

    getProperties(context: C, additionalProperties = {}): PlayCardProperties {
        return super.getProperties(context, additionalProperties);
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        if(!super.canAffect(card, context)) {
            return false;
        }
        const properties = this.getProperties(context, additionalProperties);
        return this.getLegalAbilities(card, context, properties).length > 0;
    }

    getLegalAbilities(card: DrawCard, context: C, properties: PlayCardProperties): PlayableAbility[] {
        const playable = this.getLegalActions(card, context, properties).concat(this.getLegalReactions(card, context, properties));
        return playable.filter(({ ability, createContext }) => {
            const ignoredRequirements = ['location', 'player', ...(properties.ignoredRequirements ?? [])];
            if(!properties.payCosts) {
                ignoredRequirements.push('cost');
            }
            let newContext = createContext(context.player);
            newContext.gameActionsResolutionChain = context.gameActionsResolutionChain.concat(this);
            newContext.ignoreFateCost = properties.ignoreFateCost;
            this.setPlayType(newContext, properties.playType ?? PlayType.Other, card.location);
            return !ability.meetsRequirements(newContext, ignoredRequirements);
        });
    }

    getLegalActions(card: DrawCard, context: C, properties: PlayCardProperties): PlayableAbility[] {
        const actions: BaseCardAbility[] = properties.playAction ? [properties.playAction].flat() : card.getPlayActions();
        return actions.map((ability) => ({ ability, createContext: (player) => ability.createContext(player) }));
    }

    getLegalReactions(card: DrawCard, context: C, properties: PlayCardProperties): PlayableAbility[] {
        if(!properties.allowReactions) {
            return [];
        }
        return card.getReactions().map((ability) => ({
            ability,
            createContext: (player) => ability.createContext(player, properties.event)
        }));
    }

    setPlayType(context: AbilityContext, playType: PlayType, location: Location): void {
        context.playType =
            playType ||
            context.playType ||
            (location.includes('province') && PlayType.PlayFromProvince) ||
            (location === 'hand' && PlayType.PlayFromHand) ||
            PlayType.Other;
    }

    cancelAction(context: C, properties: PlayCardProperties): number {
        if(properties.parentAction) {
            properties.parentAction.resolve(undefined, context);
        }
        return 0;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        const targets = properties.target as DrawCard | DrawCard[] | undefined;
        if(!targets || (Array.isArray(targets) && targets.length === 0)) {
            return;
        }
        let card: DrawCard = Array.isArray(targets) ? targets[0] : targets;
        let abilities = this.getLegalAbilities(card, context, properties);
        if(abilities.length === 1) {
            events.push(
                this.getPlayCardEvent(card, context, abilities[0].createContext(context.player), additionalProperties)
            );
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            source: card,
            choices: abilities.map(({ ability }) => ability.title).concat(properties.resetOnCancel ? 'Cancel' : []),
            handlers: abilities
                .map(
                    ({ createContext }) => () =>
                        events.push(
                            this.getPlayCardEvent(
                                card,
                                context,
                                createContext(context.player),
                                additionalProperties
                            )
                        )
                )
                .concat(() => this.cancelAction(context, properties))
        });
    }

    addPropertiesToEvent(event: Event, card: DrawCard, context: C): void {
        event.onPlayCardSource = context.source;
    }

    getPlayCardEvent(
        card: DrawCard,
        context: C,
        actionContext: AbilityContext,
        additionalProperties: Record<string, unknown> = {}
    ): Event {
        let properties = this.getProperties(context, additionalProperties);
        let event = this.createEvent(card, context, additionalProperties);
        this.updateEvent(event, card, context, additionalProperties);
        this.setPlayType(actionContext, properties.playType ?? PlayType.Other, card.location);
        event.replaceHandler(() =>
            context.game.queueStep(new PlayCardResolver(context.game, actionContext, this, context, properties))
        );
        return event;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
