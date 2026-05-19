import DrawCard from '../../drawcard.js';

class StayYourHand extends DrawCard {
    static id = 'stay-your-hand';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel a duel',
            when: {
                onDuelInitiated: (event, context) =>
                    event.context.player === context.player.opponent &&
                    (Object.values(event.context.targets).some((card: any) => card.controller === context.player) ||
                    (event.context.targets.target && Object.values(event.context.targets.target).some((card: any) => card.controller === context.player)))
            },
            cannotBeMirrored: true,
            effect: 'cancel the duel originating from {1}',
            effectArgs: context => context.event.context.source,
            handler: context => context.cancel()
        });
    }
}


export default StayYourHand;
