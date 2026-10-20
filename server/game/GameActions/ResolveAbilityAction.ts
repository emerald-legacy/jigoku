import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { CardAbility } from '../CardAbility.js';
import { EventName, Blocker } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import { InitiateCardAbilityEvent } from '../Events/InitiateCardAbilityEvent.js';
import type Game from '../Game.js';
import { AbilityResolver } from '../gamesteps/AbilityResolver.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { canResolveAbility, getResolutionContext } from './TriggerAbilityAction.js';

class ResolveAbilityActionResolver extends AbilityResolver {
    ignoreCosts: boolean;

    /** `ability` is the ability `context` was created for. */
    constructor(game: Game, context: AbilityContext, private readonly ability: CardAbility, ignoreCosts: boolean) {
        super(game, context);
        this.ignoreCosts = ignoreCosts;
    }

    override initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow()),
            new SimpleStep(this.game, () => this.refillProvinces())
        ]);
    }

    override getCostResults() {
        const results = super.getCostResults();
        results.canCancel = false;
        results.playCosts = false;
        results.triggerCosts = false;
        return results;
    }

    override openInitiateAbilityEventWindow() {
        const params = { card: this.context.source, ability: this.context.ability, context: this.context, resolvedWithoutTriggering: true };
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
                    context: this.context,
                    resolvedWithoutTriggering: true
                })
            );
        }
        this.game.openEventWindow(events);
    }

    override initiateAbilityEffects() {
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

    override resolveCosts() {
        if(!this.ignoreCosts) {
            super.resolveCosts();
        }
    }

    override payCosts() {
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
    /** The ability resolves "as if the conflict were at" this province (Keeper of Secret Names). */
    asIfConflictAt?: BaseCard;
}

export class ResolveAbilityAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<ResolveAbilityProperties, EventName.Unnamed, Context, 'ignoredBlockers' | 'subResolution'> {
    override name = 'resolveAbility';
    override defaultProperties = {
        ignoredBlockers: [],
        subResolution: false
    };

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['resolve {0}\'s {1} ability', [this.getProperties(context, additionalProperties).ability.title]];
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return (
            super.canAffect(card, context) &&
            canResolveAbility(
                properties,
                context,
                // resolving isn't playing (RRG Resolve an Ability): play restrictions and the Limited rule don't apply
                properties.ignoredBlockers.concat(Blocker.WrongPlayer, Blocker.WrongLocation, Blocker.LimitReached, Blocker.TriggeringRestricted,
                    Blocker.CannotPlay, Blocker.LimitedAlreadyPlayed)
            )
        );
    }

    override eventHandler(event: ActionEvent<EventName, Context>, additionalProperties: Record<string, unknown>): void {
        const properties = this.getProperties(event.context, additionalProperties);
        const newContext = getResolutionContext(properties, event.context);
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

    /** The resolved ability isn't triggered (RRG Resolve an Ability), so its targets aren't chosen by triggering this one (Hantei XXXVIII; EmeraldDB ruling). */
    override hasTargetsChosenByInitiatingPlayer(): boolean {
        return false;
    }
}
