import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class SpeakToTheHeart extends DrawCard {
    static id = 'speak-to-the-heart';

    setupCardAbilities() {
        this.conflictAction('give +1 political to a character for each faceup province')
            .target({
                cardCondition: (card) => card.isFaction('unicorn')
            }, cardLastingEffect((context) => ({
                effect: modifyPoliticalSkill(context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince))
            })))
            .chatText('give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})', (context) => ['political', context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)])
            .max(perConflict(1));
    }
}


export default SpeakToTheHeart;
