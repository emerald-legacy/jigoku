import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class ThereAreNoSecrets extends DrawCard {
    static id = 'there-are-no-secrets';

    override setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.interrupt('Gain 1 fate')
            .when({
                onMoveFate: (event, context) =>
                    context.source.parentCharacter && event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0
            })
            .gainFate();
    }
}
