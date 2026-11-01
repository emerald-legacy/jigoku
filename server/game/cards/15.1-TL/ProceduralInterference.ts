import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { gainHonor, moveCard } from '../../GameActions/GameActions.js';
import { Players, Location, CardType } from '../../Constants.js';

class ProceduralInterference extends DrawCard {
    static id = 'procedural-interference';

    override setupCardAbilities() {
        this.action('Discard all cards in a province or gain 2 honor')
            .target({
                name: 'province',
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: CardType.Province,
                cardCondition: (card) => card.location !== Location.StrongholdProvince && card.controller.getDynastyCardsInProvince(card.location).length > 0
            })
            .select({
                name: 'select',
                dependsOn: 'province',
                player: Players.Opponent
            }, {
                'Discard each card in the province': {
                    action: moveCard((context) => ({
                        destination: Location.DynastyDiscardPile,
                        target: context.targets.province.controller.getDynastyCardsInProvince(context.targets.province.location)
                    })),
                    chatText: (context) => msg`discard ${context.targets.province.controller.getDynastyCardsInProvince(context.targets.province.location)}`
                },
                'Let opponent gain 2 honor': {
                    action: gainHonor({
                        amount: 2
                    }),
                    chatText: () => msg`${'gain 2 honor'}`
                }
            });
    }
}


export default ProceduralInterference;
