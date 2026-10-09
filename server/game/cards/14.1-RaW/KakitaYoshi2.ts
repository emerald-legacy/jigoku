import DrawCard from '../../DrawCard.js';
import { dishonor } from '../../GameActions/GameActions.js';
import { TargetMode, CardType, ConflictType } from '../../Constants.js';

class KakitaYoshi2 extends DrawCard {
    static id = 'kakita-yoshi-2';

    setupCardAbilities() {
        this.reaction('Dishonor characters')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isAttacking() &&
                    event.conflict.conflictType === ConflictType.Political
            })
            .targetCards({
                mode: TargetMode.UpToVariable,
                numCardsFunc: (context) => context.player.getNumberOfFaceupProvinces(),
                cardType: CardType.Character
            }, dishonor());
    }
}


export default KakitaYoshi2;
