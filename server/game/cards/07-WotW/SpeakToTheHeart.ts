import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class SpeakToTheHeart extends DrawCard {
    static id = 'speak-to-the-heart';

    setupCardAbilities() {
        this.action('give +1 political to a character for each faceup province')
            .condition(() => this.game.isDuringConflict())
            .target('target', {
                cardCondition: (card) => card.isFaction('unicorn')
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.modifyPoliticalSkill(context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince))
            })))
            .effect('give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})', (context) => ['political', context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)])
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default SpeakToTheHeart;
