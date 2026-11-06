import { Blocker } from '../Constants.js';
import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { CardAbility } from '../CardAbility.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import { AbilityResolver } from '../gamesteps/AbilityResolver.js';
import type Player from '../Player.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { abilityContext, canResolveAbility, getResolutionContext } from './Shared/abilityResolution.js';
import type { EventName } from '../Constants.js';
import type { ActionEvent } from './GameAction.js';

export interface TriggerAbilityProperties extends CardActionProperties {
    ability: CardAbility;
    subResolution?: boolean;
    ignoredBlockers?: Blocker[];
    player?: Player;
    event?: Event;
}

export class TriggerAbilityAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<TriggerAbilityProperties, EventName.Unnamed, Context, 'ignoredBlockers' | 'subResolution'> {
    override name = 'triggerAbility';
    override defaultProperties = {
        ignoredBlockers: [],
        subResolution: false
    };

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['trigger {0}\'s {1} ability', [this.getProperties(context, additionalProperties).ability.title]];
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return (
            super.canAffect(card, context) &&
            canResolveAbility(properties, context, properties.ignoredBlockers.concat(Blocker.WrongPlayer, Blocker.WrongLocation, Blocker.LimitReached))
        );
    }

    override eventHandler(event: ActionEvent<EventName, Context>, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        const newContext = getResolutionContext(properties, event.context);
        event.context.game.queueStep(new AbilityResolver(event.context.game, newContext));
    }

    override hasTargetsChosenByInitiatingPlayer(context: Context, additionalProperties: ActionOverrides = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.ability.hasTargetsChosenByInitiatingPlayer(abilityContext(properties, context));
    }
}
