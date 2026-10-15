import { msg } from '../../../GameChat.js';
import { reveal, turnFacedown } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LayOfTheLand extends DrawCard {
    static id = 'lay-of-the-land';

    override setupCardAbilities() {
        this.action('Reveal a province or turn it facedown')
            .target({
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardType.Province,
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: (card) => !card.isBroken && card.location !== Location.StrongholdProvince
            }, reveal(), turnFacedown())
            .chatText((context) => context.target.isFaceup()
                ? msg`flip facedown ${context.target}`
                : msg`reveal ${context.target.location}`);
    }
}
