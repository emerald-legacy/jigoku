import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class Defiance extends DrawCard {
    static id = 'defiance';

    setupCardAbilities() {
        this.action('Give a character a skill bonus')
            .condition((context) => !!(context.game.isDuringConflict() && context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length))
            .target({
                cardType: CardType.Character
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(context.player.opponent?.showBid ?? 0)
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +${context.player.opponent?.showBid ?? 0}${'military'}/+${context.player.opponent?.showBid ?? 0}${'political'}`);
    }
}


export default Defiance;
