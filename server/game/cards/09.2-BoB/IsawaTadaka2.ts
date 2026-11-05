import { msg } from '../../GameChat.js';
import { CardType, Location, TargetMode } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { lookAt, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { chooseCardToDiscard, randomHandCards } from '../randomHandCards.js';

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
                const cards = removed ? randomHandCards(context.player.opponent, Array.isArray(removed) ? removed.length : 1) : hand;
                return [
                    lookAt(() => ({ target: cards })),
                    chooseCardToDiscard(cards)
                ];
            }))
            .chatText((context) => {
                const removed = context.costs.removeFromGame ?? [];
                const amount = Math.min(Array.isArray(removed) ? removed.length : 1, context.player.opponent?.hand.length ?? 0);
                return msg`look at ${amount} random card${amount === 1 ? '' : 's'} in ${context.player.opponent}'s hand`;
            });
    }
}
