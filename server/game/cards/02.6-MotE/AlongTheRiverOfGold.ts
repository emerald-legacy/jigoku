import { CardType, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { switchBaseSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { canSwitchSkills } from '../switchSkills.js';

const ELEMENT_KEY = 'along-the-river-of-gold-water';

export default class AlongTheRiverOfGold extends ProvinceCard {
    static id = 'along-the-river-of-gold';

    override setupCardAbilities() {
        this.action('switch a character\'s base skills')
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(ELEMENT_KEY)))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && canSwitchSkills(card)
            }, cardLastingEffect({
                effect: switchBaseSkills()
            }))
            .chatText('switch {0}\'s military and political skill');
    }

    protected override printedElementSymbols = [
        {
            key: ELEMENT_KEY,
            prettyName: 'Province Element',
            element: Element.Water
        }
    ];
}
