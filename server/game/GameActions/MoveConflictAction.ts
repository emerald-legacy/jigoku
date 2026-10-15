import type { AbilityContext } from '../AbilityContext.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { CardType, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { RevealAction } from './RevealAction.js';

export type MoveConflictProperties = CardActionProperties;

export class MoveConflictAction<C extends AbilityContext = AbilityContext> extends CardGameAction<MoveConflictProperties, EventName.OnConflictMoved, C> {
    override name = 'moveConflict';
    override eventName = EventName.OnConflictMoved;
    override targetType = [CardType.Province];
    override effect = 'move the conflict to {0}';
    override cost = 'moves the conflict to {0}';

    override canAffect(card: ProvinceCard, context: C): boolean {
        if(
            !context.game.isDuringConflict() ||
            card.type !== CardType.Province ||
            card.isConflictProvince() ||
            !card.canBeAttacked() ||
            !context.game.currentConflict || !context.game.currentConflict.getConflictProvinces().some((a) => a.controller === card.controller)
        ) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnConflictMoved, C>, _additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context;
        const newProvince = event.card;
        const conflict = context.game.currentConflict;
        if(!conflict || !conflict.conflictProvince) {
            return;
        }

        newProvince.inConflict = true;
        conflict.conflictProvince.inConflict = false;
        conflict.conflictProvince = newProvince;
        if(newProvince.isFacedown()) {
            const revealEvent = new RevealAction({})
                .getEvent(newProvince, context.game.getGameContext());
            context.game.openThenEventWindow(revealEvent);
        }
    }
}
