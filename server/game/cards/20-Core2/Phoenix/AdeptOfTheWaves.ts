import { msg } from '../../../GameChat.js';
import { CardType, Duration, Element } from '../../../Constants.js';
import { addKeyword } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const COVERT_ELEMENT = 'adept-of-the-waves-water';

export default class AdeptOfTheWaves extends DrawCard {
    static id = 'adept-of-the-waves';

    setupCardAbilities() {
        this.action('Grant Covert to a character')
            .target({
                cardType: CardType.Character
            }, cardLastingEffect(() => {
                const element = this.getCurrentElementSymbol(COVERT_ELEMENT);
                return {
                    duration: Duration.UntilEndOfPhase,
                    condition: () => this.game.isDuringConflict(element),
                    effect: addKeyword('covert')
                };
            }))
            .chatText((context) => msg`grant Covert during ${this.getCurrentElementSymbol(COVERT_ELEMENT)} conflicts to ${context.chatTarget()}`);
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
