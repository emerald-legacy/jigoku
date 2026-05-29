import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations } from '../../Constants.js';

class IuchiDaiyu extends DrawCard {
    static id = 'iuchi-daiyu';

    setupCardAbilities() {
        this.action({
            title: '+1 military for each faceup province',
            condition: () => this.game.isDuringConflict(),
            target: {
                gameAction: AbilityDsl.actions.cardLastingEffect((context: any) => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(
                        context.player.getNumberOfOpponentsFaceupProvinces((province: any) => province.location !== Locations.StrongholdProvince)
                    )
                }))
            },
            effect: 'give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})',
            effectArgs: (context: any) => [
                'military',
                context.player.getNumberOfOpponentsFaceupProvinces((province: any) => province.location !== Locations.StrongholdProvince)
            ]
        });
    }
}


export default IuchiDaiyu;
