import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations } from '../../Constants.js';

class SpeakToTheHeart extends DrawCard {
    static id = 'speak-to-the-heart';

    setupCardAbilities() {
        this.action({
            title: 'give +1 political to a character for each faceup province',
            condition: () => this.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardCondition: (card: any) => card.isFaction('unicorn'),
                gameAction: AbilityDsl.actions.cardLastingEffect((context: any) => ({
                    effect: AbilityDsl.effects.modifyPoliticalSkill(context.player.getNumberOfOpponentsFaceupProvinces((province: any) => province.location !== Locations.StrongholdProvince))
                }))
            },
            effect: 'give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})',
            effectArgs: (context: any) => ['political', context.player.getNumberOfOpponentsFaceupProvinces((province: any) => province.location !== Locations.StrongholdProvince)]
        });
    }
}


export default SpeakToTheHeart;
