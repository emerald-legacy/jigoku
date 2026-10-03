import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';


export default class UtakuProdigy extends DrawCard {
    static id = 'utaku-prodigy';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });

        this.wouldInterrupt('Gain 2 honor instead')
            .when({
                onModifyHonor: (event, context) => event.dueToStatusToken && (event.amount ?? 0) > 0 && event.player === context.player
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player, amount: 2 }))
            ]))
            .effect('instead gain 2 honor from the status token');
    }
}
