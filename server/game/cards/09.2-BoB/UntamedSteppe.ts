import { CardType, Players, Location } from '../../Constants.js';
import BaseCard from '../../BaseCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class UntamedSteppe extends ProvinceCard {
    static id = 'untamed-steppe';

    setupCardAbilities() {
        this.action({
            title: 'Turn another unbroken province facedown',
            target: {
                cardType: CardType.Province,
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: (card: BaseCard, context) => !(card as ProvinceCard).isBroken && card !== context.source,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}
