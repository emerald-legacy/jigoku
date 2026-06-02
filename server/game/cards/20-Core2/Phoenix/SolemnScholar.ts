import { CardType, Element } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

const BOW_ELEMENT = 'solemn-scholar-earth';

export default class SolemnScholar extends DrawCard {
    static id = 'solemn-scholar';

    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: (context) =>
                this.game.rings[this.getCurrentElementSymbol(BOW_ELEMENT)].isConsideredClaimed(context.player),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: BOW_ELEMENT,
            prettyName: 'Claimed Ring',
            element: Element.Earth
        });
        return symbols;
    }
}
