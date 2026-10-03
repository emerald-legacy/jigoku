import DrawCard from '../../DrawCard.js';
import { CardType, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaitoMai extends DrawCard {
    static id = 'kaito-mai';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyGlory(3)
        });

        this.reaction('Remove a fate')
            .when({
                onMoveFate: (event, context) =>
                    event.origin === context.source && (event.fate ?? 0) > 0 && context.game.currentPhase !== Phases.Fate
            })
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.removeFate({amount: 1}));
    }
}


export default KaitoMai;
