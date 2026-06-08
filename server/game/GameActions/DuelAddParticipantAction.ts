import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface DuelAddParticipantProperties extends CardActionProperties {
    duel: Duel;
}

export class DuelAddParticipantAction extends CardGameAction<DuelAddParticipantProperties, EventName.OnAddDuelParticipant> {
    name = 'onAddDuelParticipant';
    eventName = EventName.OnAddDuelParticipant;

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context);
        return ['extend the duel challenge to {0}', [properties.target]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);

        if(card.type !== CardType.Character) {
            return false;
        }
        if(card.location !== Location.PlayArea) {
            return false;
        }

        if(!card.allowGameAction('duel', context)) {
            return false;
        }

        return properties.duel.canAddToDuel(card, context);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnAddDuelParticipant>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { duel } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.duel = duel;
    }

    eventHandler(event: GameEvent<EventName.OnAddDuelParticipant>): void {
        event.duel.addTargetToDuel(event.card);
    }
}
