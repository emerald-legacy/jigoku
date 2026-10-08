import DrawCard from '../../DrawCard.js';
import { CardType, Players, ConflictType } from '../../Constants.js';
import { menuPrompt, placeFate, removeFate } from '../../GameActions/GameActions.js';

class TheFiresOfJustice extends DrawCard {
    static id = 'the-fires-of-justice';

    setupCardAbilities() {
        this.reaction('Remove fate or move fate to a character')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Military
            })
            .target({
                name: 'character',
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Remove all fate': removeFate((context) => ({ target: context.targets.character, amount: context.targets.character.getFate() })),
                'Move fate to character': menuPrompt((context) => ({
                    activePromptTitle: 'Select fate amount:',
                    choices: Array.from(Array(context.player.opponent?.fate), (_x, i) => (i + 1).toString()),
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage) {
                            this.game.addMessage('{0} chooses to move {1} fate from {2}\'s pool to {3}', context.player, choice, context.player.opponent, context.targets.character);
                        }
                        return { target: context.targets.character, amount: parseInt(choice) };
                    },
                    gameAction: placeFate({ origin: context.player.opponent })
                }))
            })
            .chatText('{1} {2}', (context) => [context.selects.select.choice === 'Remove all fate' ? 'remove all fate from' : 'place fate on', context.targets.character]);
    }
}


export default TheFiresOfJustice;
