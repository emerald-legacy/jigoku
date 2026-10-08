import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { discardMatching, lookAt, multipleContext } from '../../GameActions/GameActions.js';
import { shuffle } from '../../utils/random.js';

class KitsukiChiari extends DrawCard {
    static id = 'kitsuki-chiari';

    setupCardAbilities() {
        this.reaction('Name a card')
            .when({
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player &&
                    context.player.opponent && context.player.opponent.hand.length > 0
            })
            .cost(costs.nameCard())
            .gameAction(multipleContext(context => {
                const cards = shuffle(context.player.opponent?.hand ?? []).slice(0, 4).sort((a, b) => a.name.localeCompare(b.name));
                return ({
                    gameActions: [
                        lookAt(() => ({
                            target: cards
                        })),
                        discardMatching(context => ({
                            target: context.player.opponent,
                            cards: cards,
                            amount: -1, //all
                            reveal: false,
                            match: (context, card) => card.name === context.costs.namedCard
                        }))
                    ]
                });
            }))
            .effect('look at 4 random cards in {1}\'s hand and discard all cards named {2}', context => [context.player.opponent, context.costs.namedCard]);
    }


    allowAttachment(attachment: DrawCard) {
        if(attachment.hasTrait('poison') && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}

export default KitsukiChiari;
