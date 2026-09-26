import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type CardAbility from '../CardAbility.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import InitiateCardAbilityEvent from '../Events/InitiateCardAbilityEvent.js';
import type Game from '../Game.js';
import AbilityResolver from '../gamesteps/AbilityResolver.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type Player from '../Player.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { WithDefaults, ActionEvent } from './GameAction.js';

class ResolveAbilityActionResolver extends AbilityResolver {
    ignoreCosts: boolean;

    constructor(game: Game, context: TriggeredAbilityContext, ignoreCosts: boolean) {
        super(game, context);
        this.ignoreCosts = ignoreCosts;
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow()),
            new SimpleStep(this.game, () => this.refillProvinces())
        ]);
    }

    getCostResults() {
        const results = super.getCostResults();
        results.canCancel = false;
        results.playCosts = false;
        results.triggerCosts = false;
        return results;
    }

    openInitiateAbilityEventWindow() {
        const params = { card: this.context.source, ability: this.context.ability, context: this.context };
        const events = [
            this.game.getEvent(EventName.OnCardAbilityInitiated, params, () => this.queueInitiateAbilitySteps())
        ];
        if(this.context.ability.isTriggeredAbility() && !this.context.subResolution) {
            events.push(
                this.game.getEvent(EventName.OnCardAbilityTriggered, {
                    player: this.context.player,
                    card: this.context.source,
                    context: this.context
                })
            );
        }
        this.game.openEventWindow(events);
    }

    initiateAbilityEffects() {
        if(this.cancelled) {
            for(const event of this.events) {
                event.cancel();
            }
            return;
        }
        const cardAbility = this.context.ability as CardAbility;
        if(cardAbility.max && !this.context.subResolution) {
            this.context.player.incrementAbilityMax(cardAbility.maxIdentifier);
        }
        cardAbility.displayMessage(this.context, 'resolves');
        this.game.openEventWindow(
            new InitiateCardAbilityEvent(
                { card: this.context.source, context: this.context },
                () => (this.initiateAbility = true)
            )
        );
    }

    resolveCosts() {
        if(!this.ignoreCosts) {
            super.resolveCosts();
        }
    }

    payCosts() {
        if(!this.ignoreCosts) {
            super.payCosts();
        }
    }
}

export interface ResolveAbilityProperties extends CardActionProperties {
    ability: CardAbility;
    subResolution?: boolean;
    ignoredRequirements?: string[];
    player?: Player;
    event?: Event;
    choosingPlayerOverride?: Player | null;
}

export class ResolveAbilityAction<C extends AbilityContext = AbilityContext> extends CardGameAction<ResolveAbilityProperties, EventName, C> {
    name = 'resolveAbility';
    defaultProperties: Partial<ResolveAbilityProperties> = {
        subResolution: false,
        choosingPlayerOverride: undefined
    };
    constructor(
        properties: ((context: C) => ResolveAbilityProperties) | ResolveAbilityProperties
    ) {
        super(properties);
    }

    getProperties(context: C, additionalProperties = {}): WithDefaults<ResolveAbilityProperties, 'ignoredRequirements'> {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { ignoredRequirements: properties.ignoredRequirements ?? [] });
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['resolve {0}\'s {1} ability', [properties.target, properties.ability.title]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let ability = properties.ability as TriggeredAbility;
        let player = properties.player || context.player;
        if(
            !super.canAffect(card, context) ||
            !ability ||
            (!properties.subResolution && player.isAbilityAtMax(ability.maxIdentifier))
        ) {
            return false;
        }
        let newContext = this.resolvedAbilityContext(properties, context);
        let ignoredRequirements = properties.ignoredRequirements.concat(
            'player',
            'location',
            'limit',
            'triggeringRestrictions'
        );
        return !ability.meetsRequirements(newContext, ignoredRequirements);
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown>): void {
        let properties = this.getProperties(event.context, additionalProperties);
        let newContext = this.resolvedAbilityContext(properties, event.context);
        newContext.subResolution = !!properties.subResolution;
        if(properties.subResolution) {
            newContext.originatingContext = event.context.triggeringContext;
        }
        if(properties.choosingPlayerOverride) {
            newContext.choosingPlayerOverride = properties.choosingPlayerOverride;
        }
        event.context.game.queueStep(
            new ResolveAbilityActionResolver(
                event.context.game,
                newContext,
                properties.ignoredRequirements.includes('cost')
            )
        );
    }

    hasTargetsChosenByInitiatingPlayer(context: C): boolean {
        const properties = this.getProperties(context);
        return properties.ability.hasTargetsChosenByInitiatingPlayer(this.resolvedAbilityContext(properties, context));
    }

    private resolvedAbilityContext(properties: ResolveAbilityProperties, context: C) {
        return (properties.ability as TriggeredAbility).createContext(properties.player || context.player, properties.event);
    }
}
