import DrawCard from '../../DrawCard.js';
import { canOnlyBeDeclaredAsAttackerWithElement } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'fire-tensai-acolyte-fire';

class FireTensaiAcolyte extends DrawCard {
    static id = 'fire-tensai-acolyte';

    setupCardAbilities() {
        this.persistentEffect({
            effect: canOnlyBeDeclaredAsAttackerWithElement(() => this.getCurrentElementSymbol(elementKey))
        });
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Fire
        });
        return symbols;
    }
}


export default FireTensaiAcolyte;
