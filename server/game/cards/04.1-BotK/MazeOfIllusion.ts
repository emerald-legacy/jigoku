import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';
import DrawCard from '../../drawcard.js';
import type Player from '../../player.js';

type Choice = 'Even' | 'Odd';

export default class MazeOfIllusion extends DrawCard {
    static id = 'maze-of-illusion';

    public setupCardAbilities() {
        this.action({
            title: 'Dishonor and bow a character if your opponent can\'t guess your dial',
            condition: (context) => context.player.opponent !== undefined,

            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: [AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor()]
            },
            effect: 'bow and dishonor {0} if {1} can\'t guess whether their dial is even or odd',
            effectArgs: (context) => context.player.opponent as Player,
            handler: (context?: AbilityContext) => {
                if(!context) {
                    return;
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a value to set your honor dial at',
                    context: context,
                    choices: ['1', '2', '3', '4', '5'],
                    handlers: [1, 2, 3, 4, 5].map((value) => () => this.opponentGuess(value, context))
                });
            }
        });
    }

    private opponentGuess(value: number, context: AbilityContext) {
        const opponent = context.player.opponent;
        if(!opponent) {
            return;
        }
        const choices: Choice[] = ['Even', 'Odd'];
        this.game.promptWithHandlerMenu(opponent, {
            activePromptTitle: 'Guess whether your opponent set their dial to even or odd',
            context: context,
            choices: choices,
            handlers: choices.map((choice) => {
                return () => this.resolveAbility(choice, value, context);
            })
        });
    }

    private resolveAbility(choice: Choice, value: number, context: AbilityContext) {
        this.game.addMessage('{0} guesses {1}', context.player.opponent, choice);
        this.game.actions.setHonorDial({ value }).resolve(context.player, context);
        if((choice === 'Odd') === (value % 2 === 0)) {
            context.game.applyGameAction(context, { bow: context.target, dishonor: context.target });
        }
    }
}
