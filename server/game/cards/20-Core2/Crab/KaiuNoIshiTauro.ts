import { msg } from '../../../GameChat.js';
import { CardType, Players, DeckType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { attach, deckSearch } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { attachSearchedCard } from '../../attachSearchedCard.js';

export default class KaiuNoIshiTauro extends DrawCard {
    static id = 'kaiu-no-ishi-tauro';

    setupCardAbilities() {
        this.action('Return rings to fetch an attachment')
            .cost(costs.returnRings())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, deckSearch((context) => ({
                activePromptTitle: 'Select an attachment',
                deck: DeckType.Conflict,
                cardCondition: (card) => card.type === CardType.Attachment &&
                        (card.hasTrait('weapon') || card.hasTrait('armor') || card.hasTrait('item')) &&
                        !!context.target && attach({ attachment: card }).canAffect(context.target, context) &&
                        card.costLessThan(context.costs.returnedRings ? context.costs.returnedRings.length + 1 : 1),
                reveal: true,
                selectedCardsHandler: (context, event, [card]) => {
                    if(!card) {
                        context.game.addMessage(msg`${context.player} takes nothing`);
                        return;
                    }
                    attachSearchedCard(context, context.target, card, (card) => msg`${event.player} takes ${card} and attaches it to ${context.target}`);
                }
            })))
            .chatText((context) => msg`search their deck for an attachment costing ${(context.costs.returnedRings ?? []).length} or less and attach it to ${context.chatTarget()}`);
    }
}
