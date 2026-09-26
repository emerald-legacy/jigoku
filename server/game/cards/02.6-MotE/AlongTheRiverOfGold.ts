import { CardType, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

const ELEMENT_KEY = 'along-the-river-of-gold-water';

export default class AlongTheRiverOfGold extends ProvinceCard {
    static id = 'along-the-river-of-gold';

    setupCardAbilities() {
        this.action('switch a character\'s base skills')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && !card.hasDash()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.switchBaseSkills()
            }))
            .effect('switch {0}\'s military and political skill')
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(ELEMENT_KEY)));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_KEY,
            prettyName: 'Province Element',
            element: Element.Water
        });
        return symbols;
    }
}
