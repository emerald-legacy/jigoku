import DrawCard from '../../../DrawCard.js';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    override setupCardAbilities() {
        // "After the resolution of a conflict" is onConflictFinished, not onReturnHome:
        // until-end-of-conflict effects (e.g. Palm Strike's cannot-ready) expire only
        // once the conflict ends. It must have been defending throughout the resolution
        // (ruling #1121): from when the winner is determined until the conflict finishes.
        this.reaction('Ready a character or gain honor')
            .when({
                onConflictFinished: (event, context) =>
                    event.conflict.defendersAtResolution.includes(context.source) &&
                    event.conflict.defendersAtEnd.includes(context.source)
            })
            .if((context) => context.event.conflict.winner === context.source.controller)
                .gainHonor(2)
            .otherwise()
                .ready();
    }
}
