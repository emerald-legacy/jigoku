import { reveal, turnFacedown } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LayOfTheLand extends DrawCard {
    static id = 'lay-of-the-land';

    setupCardAbilities() {
        this.action('Reveal a province and discard status tokens')
            .target({
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardType.Province,
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: (card) => !card.isBroken && card.location !== Location.StrongholdProvince
            }, reveal(), turnFacedown())
            .chatText('{1} {2}', (context) => {
                const target = context.target;
                return target.isFaceup() ? ['flip facedown', target] : ['reveal', target.location];
            });
    }
}
