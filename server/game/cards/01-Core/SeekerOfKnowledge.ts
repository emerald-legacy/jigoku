import DrawCard from '../../DrawCard.js';
import { addElementAsAttacker } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'seeker-of-knowledge-air';

class SeekerOfKnowledge extends DrawCard {
    static id = 'seeker-of-knowledge';

    setupCardAbilities() {
        this.persistentEffect({
            effect: addElementAsAttacker(() => this.getCurrentElementSymbol(elementKey))
        });
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Add Element',
            element: Element.Air
        });
        return symbols;
    }
}


export default SeekerOfKnowledge;
