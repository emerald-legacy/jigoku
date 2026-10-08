import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { bow, menuPrompt, sendHome, sequential } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class BayushiKachiko extends DrawCard {
    static id = 'bayushi-kachiko';

    setupCardAbilities() {
        this.action('Send a character home')
            .condition((context) => this.game.isDuringConflict(ConflictType.Political) && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.politicalSkill < context.source.politicalSkill && card.isParticipating()
            }, sequential([
                sendHome(),
                menuPrompt((context) => ({
                    activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                    choices: ['Yes', 'No'],
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage && choice === 'Yes') {
                            context.game.addMessage(msg`${context.player} chooses to bow ${context.target} due to ${context.source}'s ability`);
                        }
                        return { target: (choice === 'Yes' ? context.target : []) };
                    },
                    gameAction: bow()
                }))
            ]));
    }
}


export default BayushiKachiko;
