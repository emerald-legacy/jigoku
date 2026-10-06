import { CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { chooseAction, dishonor, honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT = 'master-alchemist-fire';

export default class MasterAlchemist extends DrawCard {
    static id = 'master-alchemist';

    setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .cost(AbilityDsl.costs.payFateToRing(1, (ring) => ring.hasElement(this.getCurrentElementSymbol(ELEMENT))))
            .condition(() => this.game.isDuringConflict())
            .target({
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character
            }, chooseAction({
                options: {
                    'Honor this character': {
                        action: honor(),
                        message: '{0} chooses to honor {1}'
                    },
                    'Dishonor this character': {
                        action: dishonor(),
                        message: '{0} chooses to dishonor {1}'
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
