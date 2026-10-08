import { msg } from '../../GameChat.js';
import { CardType, Location, TargetMode } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardMenu, discardCard, lookAt, multipleContext } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/random.js';

export default class IsawaTadaka2 extends DrawCard {
    static id = 'isawa-tadaka-2';

    public setupCardAbilities() {
        this.action('Remove discarded characters to discard a card')
            .cost(costs.removeFromGame({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                mode: TargetMode.Unlimited
            }))
            .condition((context) => context.game.isDuringConflict() && context.player.opponent !== undefined)
            .gameAction(multipleContext((context) => {
                const removed = context.costs.removeFromGame;
                const cards =
                    context.player.opponent && removed
                        ? shuffle(context.player.opponent.hand).slice(0, Array.isArray(removed) ? removed.length : 1)
                        : [context.source];
                return {
                    gameActions: [
                        lookAt(() => ({
                            target: cards.slice().sort((a, b) => a.name.localeCompare(b.name))
                        })),
                        cardMenu({
                            cards: cards.slice().sort((a, b) => a.name.localeCompare(b.name)),
                            targets: true,
                            message: (context, card) => msg`${context.player} chooses ${card} to be discarded`,
                            gameAction: discardCard()
                        })
                    ]
                };
            }))
            .chatText((context) => {
                const removed = context.costs.removeFromGame ?? [];
                const amount = Array.isArray(removed) ? removed.length : 1;
                return msg`look at ${amount} random card${amount === 1 ? '' : 's'} in ${context.player.opponent}'s hand`;
            });
    }
}
