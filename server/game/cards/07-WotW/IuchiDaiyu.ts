import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class IuchiDaiyu extends DrawCard {
    static id = 'iuchi-daiyu';

    setupCardAbilities() {
        this.action({
            title: '+1 military for each faceup province',
            condition: () => this.game.isDuringConflict(),
            target: {
                gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(
                        context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)
                    )
                }))
            },
            effect: 'give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})',
            effectArgs: (context: AbilityContext) => [
                'military',
                context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince)
            ]
        });
    }
}


export default IuchiDaiyu;
