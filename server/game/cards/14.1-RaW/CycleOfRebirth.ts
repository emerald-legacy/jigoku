import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

import { Locations, Players, CardTypes } from '../../Constants.js';

class CycleOfRebirth extends DrawCard {
    static id = 'cycle-of-rebirth';

    setupCardAbilities() {
        this.action({
            title: 'Shuffle this and target into deck',
            max: AbilityDsl.limit.perRound(1),
            target: {
                location: Locations.Provinces,
                controller: Players.Any,
                cardCondition: card => card.type !== CardTypes.Province && card.type !== CardTypes.Stronghold
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.moveCard(context => ({
                        destination: Locations.DynastyDeck,
                        target: context.target,
                        shuffle: true,
                        bottom: true
                    })),
                    AbilityDsl.actions.moveCard(context => ({
                        destination: Locations.DynastyDeck,
                        target: context.source,
                        shuffle: true,
                        bottom: true
                    }))
                ]),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: [context.target.controller, context.source.controller],
                    location: context.game.getProvinceArray()
                }))
            ]),
            effect: 'shuffle {1}{3}{4} into {2}\'s dynasty deck{5}{6}{7}{8}{9}',
            effectArgs: context => {
                const target = (context.target as DrawCard);
                return [
                    target,
                    target.controller,
                    target.controller === context.source.controller ? ' and ' : '',
                    target.controller === context.source.controller ? context.source : '',
                    target.controller !== context.source.controller ? '. ' : '',
                    target.controller !== context.source.controller ? context.source : '',
                    target.controller !== context.source.controller ? ' is shuffled into ' : '',
                    target.controller !== context.source.controller ? context.source.controller : '',
                    target.controller !== context.source.controller ? '\'s dynasty deck' : '',
                    context.source.controller
                ];
            }
        });
    }
}


export default CycleOfRebirth;

