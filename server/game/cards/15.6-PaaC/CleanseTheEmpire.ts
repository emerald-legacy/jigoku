import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { bow, removeFate, selectCard, sequential } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class CleanseTheEmpire extends DrawCard {
    static id = 'cleanse-the-empire';

    setupCardAbilities() {
        this.reaction('Remove a fate from opponent\'s characters')
            .when({
                afterConflict: (event, context) => context.player.opponent && context.player.isAttackingPlayer() && event.conflict.winner === context.player
            })
            .gameAction(sequential([
                removeFate((context) => ({
                    target: context.player.opponent?.filterCardsInPlay((card) => card.getType() === CardType.Character) ?? []
                })),
                selectCard({
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    targets: true,
                    cardCondition: (card) => card.getFate() === 0,
                    gameAction: bow(),
                    message: (_context, card, player) => msg`${player} chooses to bow ${card}`
                })
            ]));
    }
}


export default CleanseTheEmpire;
