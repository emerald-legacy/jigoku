import { msg } from '../../GameChat.js';
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
            }, cardMenu((context) => ({
                cards: context.player.conflictDeck.filter((card) =>
                    card.type === CardType.Attachment &&
                        card.costLessThan(context.costs.returnedRings ? context.costs.returnedRings.length + 1 : 1)
                ),
                message: (context, card) => msg`${context.player} chooses to attach ${card} to ${context.target}`,
                options: [
                    { text: 'Don\'t attach a card', handler: () => this.game.addMessage(msg`${context.player} chooses not to attach anything to ${context.target}`) }
                ],
                gameAction: attach(),
                subActionProperties: (card) => ({ attachment: card })
            })))
            .gameAction(shuffleDeck({ deck: Location.ConflictDeck }))
            .chatText((context) => msg`search their deck for an attachment costing ${(context.costs.returnedRings ?? []).length} or less and attach it to ${context.chatTarget()}`);
    }
}


export default AgashaShunsen;
