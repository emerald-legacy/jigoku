import { msg } from '../../GameChat.js';
import { CardType, Element } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { chooseAction, dishonor, honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT = 'master-alchemist-fire';

export default class MasterAlchemist extends DrawCard {
    static id = 'master-alchemist';

    override setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.payFateToRing(1, (ring) => ring.hasElement(this.getCurrentElementSymbol(ELEMENT))))
            .target({
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character
            }, chooseAction({
                choices: {
                    'Honor this character': {
                        action: honor(),
                        message: (_context, target, player) => msg`${player} chooses to honor ${target}`
                    },
                    'Dishonor this character': {
                        action: dishonor(),
                        message: (_context, target, player) => msg`${player} chooses to dishonor ${target}`
                    }
                }
            }));
    }

    protected override printedElementSymbols = [
        {
            key: ELEMENT,
            prettyName: 'Ring for Fate',
            element: Element.Fire
        }
    ];
}
