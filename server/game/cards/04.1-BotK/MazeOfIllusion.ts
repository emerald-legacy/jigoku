import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

type Choice = 'Even' | 'Odd';

export default class MazeOfIllusion extends DrawCard {
    static id = 'maze-of-illusion';

    public setupCardAbilities() {
        this.action('Dishonor and bow a character if your opponent can\'t guess your dial')
            .condition((context) => context.player.opponent !== undefined)
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor())
            .handler((context) => {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a value to set your honor dial at',
                    context: context,
                    choices: ['1', '2', '3', '4', '5'],
                    handlers: [1, 2, 3, 4, 5].map((value) => () => this.opponentGuess(value, context))
                });
            })
            .effect('bow and dishonor {0} if {1} can\'t guess whether their dial is even or odd', (context) => context.player.opponent);
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
