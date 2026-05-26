import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class EmbraceTheVoid extends DrawCard {
    static id = 'embrace-the-void';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Take Fate',
            when: {
                onMoveFate: (event: any, context: TriggeredAbilityContext) =>
                    event.origin === (context.source as any).parent && event.fate > 0 && event.recipient !== context.player
            },
            effect: 'take the {1} fate being removed from {2}',
            effectArgs: (context?: TriggeredAbilityContext) => context ? [context.event.fate, (context.source as any).parent] : [],
            handler: (context?: TriggeredAbilityContext) => {
                if(!context) {
                    return;
                }
                context.event.recipient = context.player;
            }
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.cardsInPlay.some((card: any) => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default EmbraceTheVoid;
