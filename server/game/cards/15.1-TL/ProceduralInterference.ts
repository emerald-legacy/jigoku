import DrawCard from '../../drawcard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, Locations, CardTypes, TargetModes } from '../../Constants.js';

class ProceduralInterference extends DrawCard {
    static id = 'procedural-interference';

    setupCardAbilities() {
        this.action({
            title: 'Discard all cards in a province or gain 2 honor',
            targets: {
                province:{
                    location: Locations.Provinces,
                    controller: Players.Opponent,
                    cardType: CardTypes.Province,
                    cardCondition: card => card.controller.getDynastyCardsInProvince(card.location).length > 0
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'province',
                    player: Players.Opponent,
                    choices: {
                        'Discard each card in the province': AbilityDsl.actions.moveCard(context => ({
                            destination: Locations.DynastyDiscardPile,
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
