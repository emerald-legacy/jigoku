import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`give ${context.chatTarget()} +1${'military'} for each faceup non-stronghold province their opponent controls (+${context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)}${'military'})`);
    }
}


export default IuchiDaiyu;
