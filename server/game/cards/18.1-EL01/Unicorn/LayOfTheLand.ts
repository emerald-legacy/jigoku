import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';

export default class LayOfTheLand extends DrawCard {
    static id = 'lay-of-the-land';

    setupCardAbilities() {
        this.action({
            title: 'Reveal a province and discard status tokens',
            target: {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: (card: ProvinceCard) => !card.isBroken && card.location !== Locations.StrongholdProvince,
                gameAction: [AbilityDsl.actions.reveal(), AbilityDsl.actions.turnFacedown()]
            },
            effect: '{1} {2}',
            effectArgs: (context) => {
                const target = context.target as ProvinceCard;
                return target.isFaceup() ? ['flip facedown', target] : ['reveal', target.location];
            }
        });
    }
}
