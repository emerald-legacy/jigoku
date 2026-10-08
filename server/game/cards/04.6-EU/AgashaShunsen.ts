import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { attach, cardMenu, shuffleDeck } from '../../GameActions/GameActions.js';
import { Players, CardType, Location } from '../../Constants.js';

class AgashaShunsen extends DrawCard {
    static id = 'agasha-shunsen';

    setupCardAbilities() {
        this.action('Return rings to fetch an attachment')
            .cost(costs.returnRings())
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, cardMenu(context => ({
                cards: context.player.conflictDeck.filter((card) =>
                    card.type === CardType.Attachment &&
                        card.costLessThan(context.costs.returnedRings ? context.costs.returnedRings.length + 1 : 1)
                ),
                message: '{0} chooses to attach {1} to {2}',
                messageArgs: card => [context.player, card, context.target],
                options: [
                    { text: 'Don\'t attach a card', handler: () => this.game.addMessage('{0} chooses not to attach anything to {1}', context.player, context.target) }
                ],
                gameAction: attach(),
                subActionProperties: card => ({ attachment: card })
            })))
            .gameAction(shuffleDeck({ deck: Location.ConflictDeck }))
            .effect('search their deck for an attachment costing {1} or less and attach it to {0}', context => (context.costs.returnedRings ?? []).length);
    }
}


export default AgashaShunsen;
