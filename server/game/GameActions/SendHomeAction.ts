import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { CardTypes, EffectNames, EventNames } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type SendHomeProperties = CardActionProperties;

export class SendHomeAction extends CardGameAction {
    name = 'sendHome';
    eventName = EventNames.OnSendHome;
    cost = 'moving home {0}';
    effect = 'send {0} home';
    targetType = [CardTypes.Character];

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        return (
            super.canAffect(card, context) &&
            card.isParticipating() &&
            !card.anyEffect(EffectNames.ParticipatesFromHome)
        );
    }

    eventHandler(event: any): void {
        event.context.game.currentConflict.removeFromConflict(event.card);
    }
}
