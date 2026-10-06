import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class IuchiDaiyu extends DrawCard {
    static id = 'iuchi-daiyu';

    setupCardAbilities() {
        this.action('+1 military for each faceup province')
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Character
            }, cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(
                    context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)
                )
            })))
            .effect('give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})', (context) => [
                'military',
                context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)
            ]);
    }
}


export default IuchiDaiyu;
