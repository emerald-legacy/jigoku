import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TheRecedingTide extends DrawCard {
    static id = 'the-receding-tide';

    setupCardAbilities() {
        this.action('Return a character to a province')
            .target('target', {
                cardType: CardType.Character,
                location: Location.PlayArea,
                cardCondition: card => !card.hasTrait('mythic') && card.owner === this.controller
            }, AbilityDsl.actions.selectCard(context => ({
                targets: false,
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: card => card.location !== Location.StrongholdProvince,
                subActionProperties: (card: ProvinceCard) => ({ destination: card.location }),
                gameAction: AbilityDsl.actions.putIntoProvince({
                    target: context.target
                })
            })));
    }
}


export default TheRecedingTide;
