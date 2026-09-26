import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class EmbraceTheVoid extends DrawCard {
    static id = 'embrace-the-void';

    setupCardAbilities() {
        this.wouldInterrupt('Take Fate')
            .when({
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context: TriggeredAbilityContext<this>) =>
                    event.origin === context.source.parentCharacter && event.fate > 0 && event.recipient !== context.player
            })
            .handler((context) => {
                context.event.recipient = context.player;
            })
            .effect('take the {1} fate being removed from {2}', (context) => context ? [context.event.fate, context.source.parentCharacter] : []);
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardType.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default EmbraceTheVoid;
