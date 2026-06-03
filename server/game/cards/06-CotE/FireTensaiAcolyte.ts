import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';

const elementKey = 'fire-tensai-acolyte-fire';

class FireTensaiAcolyte extends DrawCard {
    static id = 'fire-tensai-acolyte';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.canOnlyBeDeclaredAsAttackerWithElement(() => this.getCurrentElementSymbol(elementKey))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Fire
        });
        return symbols;
    }
}


export default FireTensaiAcolyte;
