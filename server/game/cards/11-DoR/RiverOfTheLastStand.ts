import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class RiverOfTheLastStand extends DrawCard {
    static id = 'river-of-the-last-stand';

    setupCardAbilities() {
        this.action({
            title: 'Make opponent discard two cards and draw a card',
            condition: context => {
                if(context.player.isDefendingPlayer()) {
                    let cards = context.game.currentConflict.getConflictProvinces().map(a => context.player.getDynastyCardsInProvince(a.location));
                    return cards.some(c => c.some(card => card.isFaceup() && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall')));
                }
                return false;
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: 2
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            ])
        });
    }
}


export default RiverOfTheLastStand;
