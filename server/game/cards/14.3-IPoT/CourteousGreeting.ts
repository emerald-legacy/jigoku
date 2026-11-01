import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { bow } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

const elementKey = 'courteous-greeting-earth';

export default class CourteousGreeting extends ProvinceCard {
    static id = 'courteous-greeting';
    override setupCardAbilities() {
        this.action('Bow a character from each side')
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)))
            .target({
                name: 'defendingCharacter',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isDefending()
            }, bow())
            .target({
                name: 'attackingCharacter',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isAttacking()
            }, bow())
            .chatText((context) => msg`bow ${context.targets.defendingCharacter} and ${context.targets.attackingCharacter}`);
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Earth
        }
    ];
}
