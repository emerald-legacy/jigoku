import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { bow, menuPrompt, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiShigenobu extends DrawCard {
    static id = 'doji-shigenobu';

    setupCardAbilities() {
        this.conflictAction('Bow a character')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow())
            .then()
            .gameAction(menuPrompt((context) => ({
                activePromptTitle: 'Do you want to move home?',
                choices: ['Yes', 'No'],
                choiceHandler: (choice, displayMessage) => {
                    if(displayMessage && choice === 'Yes') {
                        context.game.addMessage('{0} chooses to move {1} home', context.player, context.source);
                    }
                    return { target: choice === 'Yes' ? context.source : [] };
                },
                gameAction: sendHome()
            })));
    }
}
