import { CardType, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { ready } from '../../GameActions/GameActions.js';

const elementKey = 'the-pursuit-of-justice-water';

export default class ThePursuitOfJustice extends ProvinceCard {
    static id = 'the-pursuit-of-justice';

    override setupCardAbilities() {
        this.action('Ready a character')
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, ready());
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Water
        }
    ];
}
