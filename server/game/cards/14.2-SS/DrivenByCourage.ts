import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'driven-by-courage-air';

export default class DrivenByCourage extends ProvinceCard {
    static id = 'driven-by-courage';

    setupCardAbilities() {
        this.action('give target character +2/+2')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyBothSkills(2)
            }))
            .effect('give {0} +2{1} and +2{2}', () => ['political', 'military'])
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)));
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Air
        });
        return symbols;
    }
}
