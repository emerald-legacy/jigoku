import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiShigenobu extends DrawCard {
    static id = 'doji-shigenobu';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            then: {
                gameAction: AbilityDsl.actions.menuPrompt((context) => ({
                    activePromptTitle: 'Do you want to move home?',
                    choices: ['Yes', 'No'],
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage && choice === 'Yes') {
                            context.game.addMessage('{0} chooses to move {1} home', context.player, context.source);
                        }
                        return { target: choice === 'Yes' ? context.source : [] };
                    },
                    gameAction: AbilityDsl.actions.sendHome()
                }))
            }
        });
    }
}
