import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class FavorableAlliance extends DrawCard {
    static id = 'favorable-alliance';

    setupCardAbilities() {
        this.action('Draw cards')
            .cost(AbilityDsl.costs.variableFateCost({
                minAmount: 1,
                maxAmount: (context) => context.player.conflictDeck.length,
                activePromptTitle: 'Choose a value for X'
            }))
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.lookAt((context) => ({
                    target: context.player.conflictDeck.slice(0, context.costs.variableFateCost),
                    message: '{0} sets aside the top {1} card{3} from their conflict deck: {2}',
                    messageArgs: (cards) => [context.player, cards.length, cards, cards.length > 1 ? 's' : '']
                })),
                AbilityDsl.actions.handler({
                    handler: (context) => {
                        const cards = context.player.conflictDeck.slice(0, context.costs.variableFateCost);
                        cards.forEach((card) => {
                            card.owner.removeCardFromPile(card);
                            card.moveTo(Location.RemovedFromGame);
                            context.player.removedFromGame.unshift(card);
                            context.source.lastingEffect(() => ({
                                until: {
                                    onCardMoved: event =>
                                        event.card === card && event.originalLocation === Location.RemovedFromGame
                                },
                                match: card,
                                effect: [AbilityDsl.effects.canPlayFromOwn(Location.RemovedFromGame, [card], this)]
                            }));
                        });
                    }
                })
            ]))
            .effect('set aside {1} card{2}', (context) => [context.costs.variableFateCost, (context.costs.variableFateCost ?? 0) > 1 ? 's' : '']);
    }
}


export default FavorableAlliance;
