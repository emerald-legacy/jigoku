import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class LordsAscendancy extends ProvinceCard {
    static id = 'lord-s-ascendancy';

    setupCardAbilities() {
        this.action('Place a fate on a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.placeFate((context) => ({
                origin: context.target.controller
            })))
            .effect('place a fate from {1}\'s fate pool on {0}', (context) => [context.target.controller]);
    }
}
