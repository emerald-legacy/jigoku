import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface DuelAddParticipantProperties extends CardActionProperties {
    duel: Duel;
}

export class DuelAddParticipantAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DuelAddParticipantProperties, EventName.OnAddDuelParticipant, C> {
    name = 'onAddDuelParticipant';
    eventName = EventName.OnAddDuelParticipant;

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['extend the duel challenge to {0}', [properties.target]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
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

    addPropertiesToEvent(event: ActionEvent<EventName.OnAddDuelParticipant, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { duel } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.duel = duel;
    }

    eventHandler(event: ActionEvent<EventName.OnAddDuelParticipant, C>): void {
        event.duel.addTargetToDuel(event.card);
    }
}
