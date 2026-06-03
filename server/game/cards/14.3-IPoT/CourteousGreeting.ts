import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'courteous-greeting-earth';

export default class CourteousGreeting extends ProvinceCard {
    static id = 'courteous-greeting';
    setupCardAbilities() {
        this.action({
            title: 'Bow a character from each side',
            conflictProvinceCondition: (province) => province.isElement(this.getCurrentElementSymbol(elementKey)),
            targets: {
                myCharacter: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                },
                oppCharacter: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            },
            effect: 'bow {1} and {2}',
            effectArgs: (context) => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Earth
        });
        return symbols;
    }
}
