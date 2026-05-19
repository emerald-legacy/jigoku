import DrawCard from '../../drawcard.js';

class WayOfTheChrysanthemum extends DrawCard {
    static id = 'way-of-the-chrysanthemum';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain extra honor after bid',
            max: ability.limit.perRound(1),
            when: {
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.afterBid
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.gainHonor(context => ({ amount: context.event.amount }))
        });
    }
}


export default WayOfTheChrysanthemum;
