import DrawCard from '../../../DrawCard.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import { cancel, gainHonor, sequential } from '../../../GameActions/GameActions.js';


export default class UtakuProdigy extends DrawCard {
    static id = 'utaku-prodigy';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });

        this.wouldInterrupt('Gain 2 honor instead')
            .when({
                onModifyHonor: (event, context) => event.dueToStatusToken && event.amount > 0 && event.player === context.player
            })
            .gameAction(sequential([
                cancel(),
                gainHonor(context => ({ target: context.player, amount: 2 }))
            ]))
            .chatText('instead gain 2 honor from the status token');
    }
}
