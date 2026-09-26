import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type Ring from '../../Ring.js';
import { Players, CardType, Location } from '../../Constants.js';

class AgashaShunsen extends DrawCard {
    static id = 'agasha-shunsen';

    setupCardAbilities() {
        this.action('Return rings to fetch an attachment')
            .cost(AbilityDsl.costs.returnRings())
            .condition(() => this.game.isDuringConflict())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.cardMenu(context => ({
                cards: context.player.conflictDeck.filter((card: DrawCard) =>
                    card.type === CardType.Attachment &&
                        card.costLessThan(context.costs.returnRing ? context.costs.returnRing.length + 1 : 1)
                ),
                message: '{0} chooses to attach {1} to {2}',
                messageArgs: card => [context.player, card, context.target],
                choices: ['Don\'t attach a card'],
                handlers: [() => this.game.addMessage('{0} chooses not to attach anything to {1}', context.player, context.target)],
                gameAction: AbilityDsl.actions.attach(),
                subActionProperties: card => ({ attachment: card })
            })))
            .gameAction(AbilityDsl.actions.shuffleDeck({ deck: Location.ConflictDeck }))
            .effect('search their deck for an attachment costing {1} or less and attach it to {0}', context => (context.costs.returnRing as Ring[]).length);
    }
}


export default AgashaShunsen;
