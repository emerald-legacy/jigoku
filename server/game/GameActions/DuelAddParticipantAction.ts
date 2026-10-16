import type { ActionOverrides } from './GameAction.js';
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

export class DuelAddParticipantAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<DuelAddParticipantProperties, EventName.OnAddDuelParticipant, Context> {
    override name = 'duelAddParticipant';
    override eventName = EventName.OnAddDuelParticipant;

    protected override effectMessage(): MessageArgs {
        return ['extend the duel challenge to {0}', []];
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);

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

    override addPropertiesToEvent(event: ActionEvent<EventName.OnAddDuelParticipant, Context>, card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { duel } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.duel = duel;
    }

    override eventHandler(event: ActionEvent<EventName.OnAddDuelParticipant, Context>): void {
        event.duel.addTargetToDuel(event.card);
    }
}
