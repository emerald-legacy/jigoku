import { CardType, Location, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/shuffle.js';

export default class IsawaTadaka2 extends DrawCard {
    static id = 'isawa-tadaka-2';

    public setupCardAbilities() {
        this.action('Remove discarded characters to discard a card')
            .cost(AbilityDsl.costs.removeFromGame({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                mode: TargetMode.Unlimited
            }))
            .condition((context) => context.game.isDuringConflict() && context.player.opponent !== undefined)
            .gameAction(AbilityDsl.actions.multipleContext((context) => {
                const removed = context.costs.removeFromGame;
                let cards =
                    context.player.opponent && removed
                        ? shuffle(context.player.opponent.hand).slice(0, Array.isArray(removed) ? removed.length : 1)
                        : [context.source];
                return {
                    gameActions: [
                        AbilityDsl.actions.lookAt(() => ({
                            target: cards.slice().sort((a, b) => a.name.localeCompare(b.name))
                        })),
                        AbilityDsl.actions.cardMenu((context) => ({
                            cards: cards.slice().sort((a, b) => a.name.localeCompare(b.name)),
                            targets: true,
                            message: '{0} chooses {1} to be discarded',
                            messageArgs: (card) => [context.player, card],
                            gameAction: AbilityDsl.actions.discardCard()
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
