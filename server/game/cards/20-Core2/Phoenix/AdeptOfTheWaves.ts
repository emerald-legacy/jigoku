import { CardType, Duration, Element } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

const COVERT_ELEMENT = 'adept-of-the-waves-water';

export default class AdeptOfTheWaves extends DrawCard {
    static id = 'adept-of-the-waves';

    setupCardAbilities() {
        this.action('Grant Covert to a character')
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.cardLastingEffect(() => {
                const element = this.getCurrentElementSymbol(COVERT_ELEMENT);
                return {
                    duration: Duration.UntilEndOfPhase,
                    condition: () => this.game.isDuringConflict(element),
                    effect: AbilityDsl.effects.addKeyword('covert')
                };
            }))
            .effect('grant Covert during {1} conflicts to {0}', () => [this.getCurrentElementSymbol(COVERT_ELEMENT)]);
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
