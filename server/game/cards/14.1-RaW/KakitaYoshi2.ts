import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, CardType } from '../../Constants.js';

class KakitaYoshi2 extends DrawCard {
    static id = 'kakita-yoshi-2';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor characters',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isAttacking() &&
                    event.conflict.conflictType === 'political'
            },
            target: {
                mode: TargetMode.UpToVariable,
                numCardsFunc: (context) => context.player.getNumberOfFaceupProvinces(),
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}


export default KakitaYoshi2;
