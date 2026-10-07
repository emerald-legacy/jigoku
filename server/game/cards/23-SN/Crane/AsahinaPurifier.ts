import DrawCard from '../../../DrawCard.js';
import { perPhase } from '../../../AbilityLimit.js';
import { cancel, gainHonor, sequential } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';


export default class AsahinaPurifier extends DrawCard {
    static id = 'asahina-purifier';

    setupCardAbilities() {
        this.wouldInterrupt('Gain honor instead of losing honor')
            .when({
                onModifyHonor: (event) => event.dueToStatusToken && event.amount < 0
            })
            .gameAction(sequential([
                cancel(),
                gainHonor(context => ({ target: context.player }))
            ]))
            .effect((context) => msg`gain 1 honor rather than having ${context.event.player} lose 1 honor from a status token`)
            .limit(perPhase(1));
    }
}
