import type { AbilityContext } from '../../../AbilityContext.js';
import { Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { takeFate, takeHonor } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

/** Levy is still in hand when its message prints, and has left it when the draw resolves. */
function hasFewerCards(context: AbilityContext): boolean {
    const hand = context.player.hand.filter((card) => card !== context.source);
    return hand.length < (context.player.opponent?.hand.length ?? 0);
}

export default class Levy2 extends DrawCard {
    static id = 'levy-2';

    public setupCardAbilities() {
        this.action('Take an honor or a fate from your opponent')
            .condition((context) => context.player.opponent !== undefined)
            .select({
                player: Players.Opponent
            }, {
                'Give your opponent 1 fate': takeFate(),
                'Give your opponent 1 honor': takeHonor()
            })
            .chatText((context) => {
                const resource = context.select === 'Give your opponent 1 fate' ? 'fate' : 'honor';
                const andDraw = hasFewerCards(context) ? ' and draw a card' : '';
                return msg`take 1 ${resource} from ${context.player.opponent}${andDraw}`;
            })
            .if(hasFewerCards)
                .draw(1);
    }
}
