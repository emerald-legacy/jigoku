import { CardType, Players, Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { turnFacedown } from '../../GameActions/GameActions.js';

export default class UntamedSteppe extends ProvinceCard {
    static id = 'untamed-steppe';

    setupCardAbilities() {
        this.action('Turn another unbroken province facedown')
            .target({
                cardType: CardType.Province,
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: (card, context) => !card.isBroken && card !== context.source
            }, turnFacedown());
    }
}
