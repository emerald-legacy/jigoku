import { CardType, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { menuPrompt, placeFate } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

const DONOR = 'donor';
const RECIPIENT = 'recipient';

export default class LastJudgmentPlains extends ProvinceCard {
    static id = 'last-judgment-plains';

    public setupCardAbilities() {
        this.action('Move fate between two of your characters')
            .target({
                name: DONOR,
                activePromptTitle: 'Choose a donor character',
                cardType: CardType.Character,
                controller: Players.Self
            })
            .target({
                name: RECIPIENT,
                dependsOn: DONOR,
                activePromptTitle: 'Choose a recipient character',
                cardType: CardType.Character,
                controller: Players.Self
            }, menuPrompt(({ targets }) => ({
                activePromptTitle: 'How much fate do you want to move?',
                choices: this.createChoiceArray(targets[DONOR].getFate()),
                choiceHandler: (choice) => ({
                    amount: parseInt(choice, 10),
                    origin: targets[DONOR],
                    target: targets[RECIPIENT]
                }),
                gameAction: placeFate()
            })))
            .effect(({ targets }) => msg`move fate from ${targets[DONOR]} to ${targets[RECIPIENT]}`);
    }

    private createChoiceArray(fate: number): string[] {
        const choices: string[] = [];
        for(let i = 1; i <= fate; i++) {
            choices.push(i.toString());
        }
        return choices;
    }
}
