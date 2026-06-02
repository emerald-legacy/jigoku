import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { Conflict } from '../Conflict.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EffectName, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type SendHomeProperties = CardActionProperties;

export class SendHomeAction extends CardGameAction {
    name = 'sendHome';
    eventName = EventName.OnSendHome;
    cost = 'moving home {0}';
    effect = 'send {0} home';
    targetType = [CardType.Character];

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        return (
            super.canAffect(card, context) &&
            card.isParticipating() &&
            !card.anyEffect(EffectName.ParticipatesFromHome)
        );
    }

    eventHandler(event: GameEvent<EventName.OnSendHome>): void {
        const context = event.context as AbilityContext;
        if(event.card) {
            (context.game.currentConflict as Conflict).removeFromConflict(event.card);
        }
    }
}
