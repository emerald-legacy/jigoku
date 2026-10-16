import DrawCard from '../../../DrawCard.js';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    override setupCardAbilities() {
        // "After the resolution of a conflict" is onConflictFinished, not onReturnHome:
        // until-end-of-conflict effects (e.g. Palm Strike's cannot-ready) expire only
        // once the conflict ends. Participation is the one recorded when the conflict was resolved.
        this.reaction('Ready a character or gain honor')
            .when({
                onConflictFinished: (event, context) => event.conflict.defendersAtResolution.includes(context.source)
            })
            .if((context) => context.event.conflict.winner === context.source.controller)
                .gainHonor(2)
            .otherwise()
                .ready();
    }
}
