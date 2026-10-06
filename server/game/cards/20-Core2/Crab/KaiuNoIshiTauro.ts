import { CardType, Players, Decks } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { deckSearch } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { attachSearchedCard } from '../../attachSearchedCard.js';

export default class KaiuNoIshiTauro extends DrawCard {
    static id = 'kaiu-no-ishi-tauro';

    setupCardAbilities() {
        this.action('Return rings to fetch an attachment')
            .cost(AbilityDsl.costs.returnRings())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, deckSearch(context => ({
                activePromptTitle: 'Select an attachment',
                deck: Decks.ConflictDeck,
                cardCondition: (card) => card.type === CardType.Attachment &&
                        (card.hasTrait('weapon') || card.hasTrait('armor') || card.hasTrait('item')) &&
                        !!context.target && context.game.actions.attach({ attachment: card }).canAffect(context.target, context) &&
                        card.costLessThan(context.costs.returnRing ? context.costs.returnRing.length + 1 : 1),
                shuffle: true,
                reveal: true,
                selectedCardsHandler: (context, event, [card]) => {
                    if(!card) {
                        context.game.addMessage('{0} takes nothing', context.player);
                        return;
                    }
                    attachSearchedCard(context, context.target, card, '{0} takes {1} and attaches it to {2}', (card) => [event.player, card, context.target]);
                }
            })))
            .effect('search their deck for an attachment costing {1} or less and attach it to {0}', (context) => (context.costs.returnRing ?? []).length);
    }
}
