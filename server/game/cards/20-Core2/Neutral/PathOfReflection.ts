import { CardType, Element } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { switchBaseSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class PathOfReflection extends ProvinceCard {
    static id = 'path-of-reflection';

    private readonly conflictElement = `${PathOfReflection.id}-conflict-water`;
    private readonly provinceElement = `${PathOfReflection.id}-province-water`;

    setupCardAbilities() {
        this.action('switch a character\'s base skills')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && !card.hasDash()
            }, cardLastingEffect({ effect: switchBaseSkills() }))
            .chatText('switch {0}\'s military and political skill')
            .conflictProvinceCondition((province, context) =>
                province.isElement(this.getCurrentElementSymbol(this.provinceElement)) ||
                (context.game.currentConflict?.hasElement(this.getCurrentElementSymbol(this.conflictElement)) ?? false));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push(
            { prettyName: 'Conflict Element', key: this.conflictElement, element: Element.Water },
            { prettyName: 'Province Element', key: this.provinceElement, element: Element.Water }
        );
        return symbols;
    }
}
