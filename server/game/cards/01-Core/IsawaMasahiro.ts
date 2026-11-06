import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import { CardType, Element } from '../../Constants.js';

const elementKey = 'isawa-masahiro-fire';

class IsawaMasahiro extends DrawCard {
    static id = 'isawa-masahiro';

    override setupCardAbilities() {
        this.action('Bow to discard a participating character')
            .condition(() => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.costLessThan(3) && card.isParticipating()
            }, discardFromPlay());
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Fire
        }
    ];
}


export default IsawaMasahiro;
