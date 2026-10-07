import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class ThereAreNoSecrets extends DrawCard {
    static id = 'there-are-no-secrets';

    setupCardAbilities() {
        this.wouldInterrupt('Gain 1 fate')
            .when({
                onMoveFate: (event, context) =>
                    context.source.parentCharacter && event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0
            })
            .gainFate();
    }

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
