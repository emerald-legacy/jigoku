import DrawCard from '../../DrawCard.js';
import { addElementAsAttacker } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'seeker-of-knowledge-air';

class SeekerOfKnowledge extends DrawCard {
    static id = 'seeker-of-knowledge';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: addElementAsAttacker(() => this.getCurrentElementSymbol(elementKey))
        });
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Add Element',
            element: Element.Air
        }
    ];
}


export default SeekerOfKnowledge;
