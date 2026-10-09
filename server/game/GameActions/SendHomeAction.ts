import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EffectName, EventName, RestrictionType } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type SendHomeProperties = CardActionProperties;

export class SendHomeAction<C extends AbilityContext = AbilityContext> extends CardGameAction<SendHomeProperties, EventName.OnSendHome, C> {
    name = 'sendHome';
    restriction = RestrictionType.SendHome;
    eventName = EventName.OnSendHome;
    cost = 'moving home {0}';
    effect = 'send {0} home';
    targetType = [CardType.Character];

    canAffect(card: DrawCard, context: C): boolean {
        return (
            super.canAffect(card, context) &&
            card.isParticipating() &&
            !card.anyEffect(EffectName.ParticipatesFromHome)
        );
    }

    eventHandler(event: ActionEvent<EventName.OnSendHome, C>): void {
        const context = event.context;
        context.game.requireConflict().removeFromConflict(event.card);
    }
}
