import { msg } from '../../GameChat.js';
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
                cardCondition: (card) => card.type !== CardType.Province && card.type !== CardType.Stronghold
            })
            .gameAction(sequential([
                multiple([
                    moveCard((context) => ({
                        destination: Location.DynastyDeck,
                        target: context.target,
                        shuffle: true,
                        bottom: true
                    })),
                    moveCard((context) => ({
                        destination: Location.DynastyDeck,
                        target: context.source,
                        shuffle: true,
                        bottom: true
                    }))
                ]),
                refillFaceup((context) => ({
                    target: context.target ? [context.target.controller, context.source.controller] : [context.source.controller],
                    location: context.game.getProvinceArray()
                }))
            ]))
            .chatText((context) => {
                const target = context.target;
                return target.controller === context.source.controller
                    ? msg`shuffle ${target} and ${context.source} into ${target.controller}'s dynasty deck`
                    : msg`shuffle ${target} into ${target.controller}'s dynasty deck. ${context.source} is shuffled into ${context.source.controller}'s dynasty deck`;
            })
            .max(perRound(1));
    }
}


export default CycleOfRebirth;

