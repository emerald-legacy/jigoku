import { msg } from '../../GameChat.js';
import { CardType, Element } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { chooseAction, dishonor, honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT = 'master-alchemist-fire';

export default class MasterAlchemist extends DrawCard {
    static id = 'master-alchemist';

    setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .cost(costs.payFateToRing(1, (ring) => ring.hasElement(this.getCurrentElementSymbol(ELEMENT))))
            .condition(() => this.game.isDuringConflict())
            .target({
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character
            }, chooseAction({
                options: {
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

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT,
            prettyName: 'Ring for Fate',
            element: Element.Fire
        });
        return symbols;
    }
}
