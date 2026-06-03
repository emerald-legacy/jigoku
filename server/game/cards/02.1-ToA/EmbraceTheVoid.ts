import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class EmbraceTheVoid extends DrawCard {
    static id = 'embrace-the-void';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Take Fate',
            when: {
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context: TriggeredAbilityContext) =>
                    event.origin === (context.source as any).parent && event.fate > 0 && event.recipient !== context.player
            },
            effect: 'take the {1} fate being removed from {2}',
            effectArgs: (context: TriggeredAbilityContext) => context ? [context.event.fate, (context.source as any).parent] : [],
            handler: (context: TriggeredAbilityContext) => {
                context.event.recipient = context.player;
            }
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.cardsInPlay.some((card: any) => card.getType() === CardType.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default EmbraceTheVoid;
