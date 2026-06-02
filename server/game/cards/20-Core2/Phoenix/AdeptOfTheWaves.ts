import { CardType, Duration, Element } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

const COVERT_ELEMENT = 'adept-of-the-waves-water';

export default class AdeptOfTheWaves extends DrawCard {
    static id = 'adept-of-the-waves';

    elementWhenTriggered!: string;

    setupCardAbilities() {
        this.action({
            title: 'Grant Covert to a character',
            target: {
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.handler({
                        handler: () => {
                            this.elementWhenTriggered = this.getCurrentElementSymbol(COVERT_ELEMENT);
                        }
                    }),
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        duration: Duration.UntilEndOfPhase,
                        condition: () => this.game.isDuringConflict(this.elementWhenTriggered),
                        effect: AbilityDsl.effects.addKeyword('covert')
                    }))
                ])
            },
            effect: 'grant Covert during {1} conflicts to {0}',
            effectArgs: () => [this.getCurrentElementSymbol(COVERT_ELEMENT)]
        });
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: COVERT_ELEMENT,
            prettyName: 'Contested Ring',
            element: Element.Water
        });
        return symbols;
    }
}
