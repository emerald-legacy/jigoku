import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKey = 'seeker-of-knowledge-air';

class SeekerOfKnowledge extends DrawCard {
    static id = 'seeker-of-knowledge';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.addElementAsAttacker(() => this.getCurrentElementSymbol(elementKey))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Add Element',
            element: Elements.Air
        });
        return symbols;
    }
}


export default SeekerOfKnowledge;
