import { msg } from '../../GameChat.js';
import { CardType, Location, TargetMode } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardMenu, discardCard, lookAt, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/random.js';

export default class IsawaTadaka2 extends DrawCard {
    static id = 'isawa-tadaka-2';

    public override setupCardAbilities() {
        this.action('Remove discarded characters to discard a card')
            .condition((context) => context.game.isDuringConflict() && context.player.opponent !== undefined)
            .cost(costs.removeFromGame({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                mode: TargetMode.Unlimited
            }))
            .gameAction(multiple((context) => {
                const removed = context.costs.removeFromGame;
                const hand = context.player.opponent?.hand ?? [];
                // before the cost is paid, the whole hand stands for the cards that will be looked at
                const cards = removed ? shuffle(hand).slice(0, Array.isArray(removed) ? removed.length : 1) : hand;
                return [
                    lookAt(() => ({
                        target: cards.slice().sort((a, b) => a.name.localeCompare(b.name))
                    })),
                    cardMenu({
                        cards: cards.slice().sort((a, b) => a.name.localeCompare(b.name)),
                        targets: true,
                        message: (context, card) => msg`${context.player} chooses ${card} to be discarded`,
                        gameAction: discardCard()
                    })
                ];
            }))
            .chatText((context) => {
                const removed = context.costs.removeFromGame ?? [];
                const amount = Array.isArray(removed) ? removed.length : 1;
                return msg`look at ${amount} random card${amount === 1 ? '' : 's'} in ${context.player.opponent}'s hand`;
            });
    }
}
