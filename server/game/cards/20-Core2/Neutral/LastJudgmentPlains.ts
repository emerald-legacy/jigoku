import { CardType, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { chooseAmount, placeFate } from '../../../GameActions/GameActions.js';
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
            }, chooseAmount(({ targets }) => ({
                activePromptTitle: 'How much fate do you want to move?',
                max: targets[DONOR].getFate(),
                gameAction: (amount) => placeFate({ amount, origin: targets[DONOR], target: targets[RECIPIENT] })
            })))
            .chatText(({ targets }) => msg`move fate from ${targets[DONOR]} to ${targets[RECIPIENT]}`);
    }
}
