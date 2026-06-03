import { CardType, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'the-pursuit-of-justice-water';

export default class ThePursuitOfJustice extends ProvinceCard {
    static id = 'the-pursuit-of-justice';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            conflictProvinceCondition: (province) => province.isElement(this.getCurrentElementSymbol(elementKey)),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Water
        });
        return symbols;
    }
}
