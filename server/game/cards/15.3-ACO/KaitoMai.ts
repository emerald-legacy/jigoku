import DrawCard from '../../DrawCard.js';
import { CardType, Phases } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { removeFate } from '../../GameActions/GameActions.js';

class KaitoMai extends DrawCard {
    static id = 'kaito-mai';

    setupCardAbilities() {
        this.dire({
            effect: modifyGlory(3)
        });

        this.reaction('Remove a fate')
            .when({
                onMoveFate: (event, context) =>
                    event.origin === context.source && (event.fate ?? 0) > 0 && context.game.currentPhase !== Phases.Fate
            })
            .target({
                cardType: CardType.Character
            }, removeFate());
    }
}


export default KaitoMai;
