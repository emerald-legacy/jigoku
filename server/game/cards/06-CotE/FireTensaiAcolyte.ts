import DrawCard from '../../DrawCard.js';
import { canOnlyBeDeclaredAsAttackerWithElement } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'fire-tensai-acolyte-fire';

class FireTensaiAcolyte extends DrawCard {
    static id = 'fire-tensai-acolyte';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: canOnlyBeDeclaredAsAttackerWithElement(() => this.getCurrentElementSymbol(elementKey))
        });
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Fire
        }
    ];
}


export default FireTensaiAcolyte;
