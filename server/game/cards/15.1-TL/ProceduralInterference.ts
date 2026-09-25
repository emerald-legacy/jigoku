import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, Location, CardType } from '../../Constants.js';

class ProceduralInterference extends DrawCard {
    static id = 'procedural-interference';

    setupCardAbilities() {
        this.action('Discard all cards in a province or gain 2 honor')
            .target('province', {
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: CardType.Province,
                cardCondition: card => card.controller.getDynastyCardsInProvince(card.location).length > 0
            })
            .select('select', {
                dependsOn: 'province',
                player: Players.Opponent
            }, {
                'Discard each card in the province': AbilityDsl.actions.moveCard(context => ({
                    destination: Location.DynastyDiscardPile,
                    target: (context.targets.province).controller.getDynastyCardsInProvince((context.targets.province).location)
                })),
                'Let opponent gain 2 honor': AbilityDsl.actions.gainHonor({
                    amount: 2
                })
            })
            .effect('{1}{2}', context => {
                if(context.selects.select.choice === 'let opponent gain 2 honor') {
                    return ['gain 2 honor', ''];
                }
                return ['discard ', (context.targets.province).controller.getDynastyCardsInProvince((context.targets.province).location)];
            });
    }
}


export default ProceduralInterference;
