import { CardTypes, Players, Locations } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class UntamedSteppe extends ProvinceCard {
    static id = 'untamed-steppe';

    setupCardAbilities() {
        this.action({
            title: 'Turn another unbroken province facedown',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: (card, context) => !card.isBroken && card !== context.source,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}
