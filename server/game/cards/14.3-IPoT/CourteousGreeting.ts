import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { bow } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

const elementKey = 'courteous-greeting-earth';

export default class CourteousGreeting extends ProvinceCard {
    static id = 'courteous-greeting';
    setupCardAbilities() {
        this.action('Bow a character from each side')
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, bow())
            .target({
                name: 'oppCharacter',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow())
            .effect((context) => msg`bow ${context.targets.myCharacter} and ${context.targets.oppCharacter}`)
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Earth
        });
        return symbols;
    }
}
