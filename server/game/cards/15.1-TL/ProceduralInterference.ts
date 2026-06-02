import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, Location, CardType, TargetMode } from '../../Constants.js';

class ProceduralInterference extends DrawCard {
    static id = 'procedural-interference';

    setupCardAbilities() {
        this.action({
            title: 'Discard all cards in a province or gain 2 honor',
            targets: {
                province:{
                    location: Location.Provinces,
                    controller: Players.Opponent,
                    cardType: CardType.Province,
                    cardCondition: card => card.controller.getDynastyCardsInProvince(card.location).length > 0
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'province',
                    player: Players.Opponent,
                    choices: {
                        'Discard each card in the province': AbilityDsl.actions.moveCard(context => ({
                            destination: Location.DynastyDiscardPile,
                            target: context.targets.province.controller.getDynastyCardsInProvince(context.targets.province.location)
                        })),
                        'Let opponent gain 2 honor': AbilityDsl.actions.gainHonor({
                            amount: 2
                        })
                    }
                }
            },
            effect:'{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'let opponent gain 2 honor') {
                    return ['gain 2 honor', ''];
                }
                return ['discard ', (context.targets.province as ProvinceCard).controller.getDynastyCardsInProvince((context.targets.province as ProvinceCard).location)];
            }
        });
    }
}


export default ProceduralInterference;
