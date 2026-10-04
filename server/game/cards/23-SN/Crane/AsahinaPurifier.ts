import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';


export default class AsahinaPurifier extends DrawCard {
    static id = 'asahina-purifier';

    setupCardAbilities() {
        this.wouldInterrupt('Gain honor instead of losing honor')
            .when({
                onModifyHonor: (event) => event.dueToStatusToken && event.amount < 0
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
            ]))
            .effect('gain 1 honor rather than having {1} lose 1 honor from a status token', context => [context.event.player])
            .limit(AbilityDsl.limit.perPhase(1));
    }
}
