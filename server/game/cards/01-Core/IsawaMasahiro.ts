import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Element } from '../../Constants.js';

const elementKey = 'isawa-masahiro-fire';

class IsawaMasahiro extends DrawCard {
    static id = 'isawa-masahiro';

    setupCardAbilities() {
        this.action({
            title: 'Bow to discard an enemy character' ,
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.costLessThan(3) && card.isParticipating(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IsawaMasahiro;
