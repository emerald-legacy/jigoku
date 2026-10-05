import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class WayOfTheChrysanthemum extends DrawCard {
    static id = 'way-of-the-chrysanthemum';

    setupCardAbilities() {
        this.reaction('Gain extra honor after bid')
            .when({
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.afterBid
            })
            .gameAction(AbilityDsl.actions.gainHonor((context) => ({ amount: context.event.amount })))
            .max(AbilityDsl.limit.perRound(1))
            .cannotBeMirrored();
    }
}


export default WayOfTheChrysanthemum;
