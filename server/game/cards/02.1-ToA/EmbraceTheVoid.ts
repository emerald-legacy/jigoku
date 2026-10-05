import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { controlsShugenja } from '../controlsShugenja.js';

class EmbraceTheVoid extends DrawCard {
    static id = 'embrace-the-void';

    setupCardAbilities() {
        this.wouldInterrupt('Take Fate')
            .when({
                onMoveFate: (event, context) =>
                    event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0 && event.recipient !== context.player
            })
            .handler((context) => {
                context.event.recipient = context.player;
            })
            .effect('take the {1} fate being removed from {2}', (context) => [context.event.fate, context.source.parentCharacter]);
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!controlsShugenja(context.player)) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default EmbraceTheVoid;
