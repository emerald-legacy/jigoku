import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { CardAbility } from '../CardAbility.js';
import { EventName, Blocker } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import { InitiateCardAbilityEvent } from '../Events/InitiateCardAbilityEvent.js';
import type Game from '../Game.js';
import { AbilityResolver } from '../gamesteps/AbilityResolver.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { abilityContext, canResolveAbility } from './TriggerAbilityAction.js';

class ResolveAbilityActionResolver extends AbilityResolver {
    ignoreCosts: boolean;

    /** `ability` is the ability `context` was created for. */
    constructor(game: Game, context: AbilityContext, private readonly ability: CardAbility, ignoreCosts: boolean) {
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
        const events: Event[] = [
            this.game.getEvent(EventName.OnCardAbilityInitiated, params, () => this.queueInitiateAbilitySteps())
        ];
        const ability = this.context.ability;
        if(ability.isTriggeredAbility() && ability.isCardAbilityInstance() && !this.context.subResolution) {
            events.push(
                this.game.getEvent(EventName.OnCardAbilityTriggered, {
                    player: this.context.player,
                    card: this.context.source,
                    ability,
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
        const cardAbility = this.ability;
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
    ignoredBlockers?: Blocker[];
    player?: Player;
    event?: Event;
    choosingPlayerOverride?: Player | null;
}

export class ResolveAbilityAction<C extends AbilityContext = AbilityContext> extends CardGameAction<ResolveAbilityProperties, EventName.Unnamed, C, 'ignoredBlockers' | 'subResolution'> {
    name = 'resolveAbility';
    defaultProperties = {
        ignoredBlockers: [],
        subResolution: false
    };

    protected effectMessage(context: C): MessageArgs {
        return ['resolve {0}\'s {1} ability', [this.getProperties(context).ability.title]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return (
            super.canAffect(card, context) &&
            canResolveAbility(
                properties,
                context,
                properties.ignoredBlockers.concat(Blocker.WrongPlayer, Blocker.WrongLocation, Blocker.LimitReached, Blocker.TriggeringRestricted)
            )
        );
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown>): void {
        const properties = this.getProperties(event.context, additionalProperties);
        const newContext = abilityContext(properties, event.context);
        newContext.subResolution = properties.subResolution;
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
                properties.ability,
                properties.ignoredBlockers.includes(Blocker.CannotPayCost)
            )
        );
    }

    hasTargetsChosenByInitiatingPlayer(context: C): boolean {
        const properties = this.getProperties(context);
        return properties.ability.hasTargetsChosenByInitiatingPlayer(abilityContext(properties, context));
    }
}
