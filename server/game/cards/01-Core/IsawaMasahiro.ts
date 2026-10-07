import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import { CardType, Element } from '../../Constants.js';

const elementKey = 'isawa-masahiro-fire';

class IsawaMasahiro extends DrawCard {
    static id = 'isawa-masahiro';

    setupCardAbilities() {
        this.action('Bow to discard an enemy character')
            .cost(costs.bowSelf())
            .condition(() => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.costLessThan(3) && card.isParticipating()
            }, discardFromPlay());
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IsawaMasahiro;
