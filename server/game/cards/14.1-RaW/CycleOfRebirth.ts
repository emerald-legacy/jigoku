import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { moveCard, multiple, refillFaceup, sequential } from '../../GameActions/GameActions.js';

import { Location, Players, CardType } from '../../Constants.js';

class CycleOfRebirth extends DrawCard {
    static id = 'cycle-of-rebirth';

    setupCardAbilities() {
        this.action('Shuffle this and target into deck')
            .target({
                location: Location.Provinces,
                controller: Players.Any,
                cardCondition: card => card.type !== CardType.Province && card.type !== CardType.Stronghold
            })
            .gameAction(sequential([
                multiple([
                    moveCard(context => ({
                        destination: Location.DynastyDeck,
                        target: context.target,
                        shuffle: true,
                        bottom: true
                    })),
                    moveCard(context => ({
                        destination: Location.DynastyDeck,
                        target: context.source,
                        shuffle: true,
                        bottom: true
                    }))
                ]),
                refillFaceup(context => ({
                    target: context.target ? [context.target.controller, context.source.controller] : [context.source.controller],
                    location: context.game.getProvinceArray()
                }))
            ]))
            .effect('shuffle {1}{3}{4} into {2}\'s dynasty deck{5}{6}{7}{8}{9}', context => {
                const target = context.target;
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
            })
            .max(perRound(1));
    }
}


export default CycleOfRebirth;

