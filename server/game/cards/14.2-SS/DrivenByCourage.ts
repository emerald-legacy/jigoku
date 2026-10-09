import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`give ${context.chatTarget()} +2${'political'} and +2${'military'}`)
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
