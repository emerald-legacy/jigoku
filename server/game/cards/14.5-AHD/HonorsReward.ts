import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyGlory } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

const elementKey = 'honor-s-reward-fire';

export default class HonorsReward extends ProvinceCard {
    static id = 'honor-s-reward';

    override setupCardAbilities() {
        this.action('give target character +3 glory')
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)))
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect(() => ({
                effect: modifyGlory(3)
            })))
            .chatText('give {0} +3 glory');
    }

    override getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Fire
        });
        return symbols;
    }
}
