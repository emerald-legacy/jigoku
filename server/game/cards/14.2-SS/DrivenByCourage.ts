import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

const elementKey = 'driven-by-courage-air';

export default class DrivenByCourage extends ProvinceCard {
    static id = 'driven-by-courage';

    setupCardAbilities() {
        this.action('give target character +2/+2')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyBothSkills(2)
            }))
            .chatText('give {0} +2{1} and +2{2}', () => ['political', 'military'])
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Air
        });
        return symbols;
    }
}
