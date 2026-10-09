import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { gainHonor, moveCard } from '../../GameActions/GameActions.js';
import { Players, Location, CardType } from '../../Constants.js';

class ProceduralInterference extends DrawCard {
    static id = 'procedural-interference';

    setupCardAbilities() {
        this.action('Discard all cards in a province or gain 2 honor')
            .target({
                name: 'province',
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: CardType.Province,
                cardCondition: (card) => card.controller.getDynastyCardsInProvince(card.location).length > 0
            })
            .select({
                name: 'select',
                dependsOn: 'province',
                player: Players.Opponent
            }, {
                'Discard each card in the province': moveCard((context) => ({
                    destination: Location.DynastyDiscardPile,
                    target: context.targets.province.controller.getDynastyCardsInProvince(context.targets.province.location)
                })),
                'Let opponent gain 2 honor': gainHonor({
                    amount: 2
                })
            })
            .chatText((context) => context.selects.select.choice === 'Let opponent gain 2 honor'
                ? msg`${'gain 2 honor'}`
                : msg`discard ${context.targets.province.controller.getDynastyCardsInProvince(context.targets.province.location)}`);
    }
}


export default ProceduralInterference;
