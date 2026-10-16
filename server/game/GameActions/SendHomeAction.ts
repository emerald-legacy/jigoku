import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EffectName, EventName, RestrictionType } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type SendHomeProperties = CardActionProperties;

export class SendHomeAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<SendHomeProperties, EventName.OnSendHome, Context> {
    override name = 'sendHome';
    override restriction = RestrictionType.SendHome;
    override eventName = EventName.OnSendHome;
    override cost = 'moving home {0}';
    override effect = 'send {0} home';
    override targetType = [CardType.Character];

    override canAffect(card: DrawCard, context: Context): boolean {
        return (
            super.canAffect(card, context) &&
            card.isParticipating() &&
            !card.anyEffect(EffectName.ParticipatesFromHome)
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnSendHome, Context>): void {
        const context = event.context;
        context.game.requireConflict().removeFromConflict(event.card);
    }
}
