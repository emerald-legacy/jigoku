import type { ActionOverrides } from './GameAction.js';
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
import { type ActionEvent, targetList, type WithDefaults } from './GameAction.js';

class PlayCardResolver extends AbilityResolver {
    playGameAction: PlayCardAction;
    gameActionContext: AbilityContext;
    gameActionProperties: ResolvedPlayCardProperties;
    cancelPressed: boolean;
    constructor(game: Game, context: AbilityContext, playGameAction: PlayCardAction, gameActionContext: AbilityContext, gameActionProperties: ResolvedPlayCardProperties) {
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
            if(location === Location.ConflictDeck && this.gameActionProperties.destinationOptions.bottom) {
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
            this.game.queueSimpleStep(() => this.gameActionProperties.postHandler(this.context));
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
    destinationOptions?: { bottom?: boolean };
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

type PlayCardDefaults =
    | 'resetOnCancel'
    | 'postHandler'
    | 'playType'
    | 'destinationOptions'
    | 'payCosts'
    | 'ignoreFateCost'
    | 'allowReactions'
    | 'ignoredRequirements';

type ResolvedPlayCardProperties = WithDefaults<PlayCardProperties, PlayCardDefaults>;

interface PlayableAbility {
    ability: BaseCardAbility;
    createContext(player: Player): AbilityContext;
}

export class PlayCardAction<C extends AbilityContext = AbilityContext> extends CardGameAction<PlayCardProperties, EventName.Unnamed, C, PlayCardDefaults> {
    name = 'playCard';
    effect = 'play {0} as if it were in their hand';
    defaultProperties = {
        resetOnCancel: false,
        postHandler: () => true,
        playType: PlayType.Other,
        destinationOptions: {},
        payCosts: true,
        ignoreFateCost: false,
        allowReactions: false,
        ignoredRequirements: []
    };

    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        if(!super.canAffect(card, context)) {
            return false;
        }
        const properties = this.getProperties(context, additionalProperties);
        return this.getLegalAbilities(card, context, properties).length > 0;
    }

    getLegalAbilities(card: DrawCard, context: C, properties: ResolvedPlayCardProperties): PlayableAbility[] {
        const playable = this.getLegalActions(card, context, properties).concat(this.getLegalReactions(card, context, properties));
        return playable.filter(({ ability, createContext }) => {
            const ignoredRequirements = ['location', 'player', ...properties.ignoredRequirements];
            if(!properties.payCosts) {
                ignoredRequirements.push('cost');
            }
            const newContext = createContext(context.player);
            newContext.gameActionsResolutionChain = context.gameActionsResolutionChain.concat(this);
            newContext.ignoreFateCost = properties.ignoreFateCost;
            this.setPlayType(newContext, properties.playType);
            return !ability.meetsRequirements(newContext, ignoredRequirements);
        });
    }

    getLegalActions(card: DrawCard, _context: C, properties: PlayCardProperties): PlayableAbility[] {
        const actions: BaseCardAbility[] = properties.playAction ? [properties.playAction].flat() : card.getPlayActions();
        return actions.map((ability) => ({ ability, createContext: (player) => ability.createContext(player) }));
    }

    getLegalReactions(card: DrawCard, _context: C, properties: PlayCardProperties): PlayableAbility[] {
        if(!properties.allowReactions) {
            return [];
        }
        return card.getReactions().map((ability) => ({
            ability,
            createContext: (player) => ability.createContext(player, properties.event)
        }));
    }

    setPlayType(context: AbilityContext, playType: PlayType): void {
        context.playType = playType;
    }

    cancelAction(context: C, properties: PlayCardProperties): void {
        if(properties.parentAction) {
            properties.parentAction.resolve(undefined, context);
        }
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const [card] = targetList(properties.target);
        if(!card || !card.isDrawCard()) {
            return;
        }
        const abilities = this.getLegalAbilities(card, context, properties);
        if(abilities.length === 1) {
            events.push(
                this.getPlayCardEvent(card, context, abilities[0].createContext(context.player), additionalProperties)
            );
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            source: card,
            options: abilities
                .map(({ ability, createContext }) => ({
                    text: ability.title,
                    handler: () => {
                        events.push(this.getPlayCardEvent(card, context, createContext(context.player), additionalProperties));
                    }
                }))
                .concat(properties.resetOnCancel ? [{ text: 'Cancel', handler: () => this.cancelAction(context, properties) }] : [])
        });
    }

    addPropertiesToEvent(event: ActionEvent<EventName.Unnamed, C>, card: DrawCard, context: C): void {
        super.addPropertiesToEvent(event, card, context);
        event.onPlayCardSource = context.source;
    }

    getPlayCardEvent(
        card: DrawCard,
        context: C,
        actionContext: AbilityContext,
        additionalProperties: ActionOverrides = {}
    ): Event {
        const properties = this.getProperties(context, additionalProperties);
        const event = this.createEvent(card, context, additionalProperties);
        this.updateEvent(event, card, context, additionalProperties);
        this.setPlayType(actionContext, properties.playType);
        event.replaceHandler(() =>
            context.game.queueStep(new PlayCardResolver(context.game, actionContext, this, context, properties))
        );
        return event;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
