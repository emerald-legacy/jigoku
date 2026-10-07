import { CardType, Location, TargetMode } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardMenu, discardCard, lookAt, multipleContext } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/shuffle.js';

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
                        cardMenu((context) => ({
                            cards: cards.slice().sort((a, b) => a.name.localeCompare(b.name)),
                            targets: true,
                            message: '{0} chooses {1} to be discarded',
                            messageArgs: (card) => [context.player, card],
                            gameAction: discardCard()
                        }))
                    ]
                };
            }))
            .effect('look at {1} random card{3} in {2}\'s hand', (context) => {
                const removed = context.costs.removeFromGame ?? [];
                const amount = Array.isArray(removed) ? removed.length : 1;
                return [amount, context.player.opponent, amount === 1 ? '' : 's'];
            });
    }
}
