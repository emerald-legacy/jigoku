import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'volcanic-troll-fire';
class VolcanicTroll extends DrawCard {
    static id = 'volcanic-troll';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.rings[this.getCurrentElementSymbol(elementKey)].isUnclaimed(),
            effect: modifyBothSkills(2)
        });
    }

    override getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Unclaimed Ring',
            element: Element.Fire
        });
        return symbols;
    }
}


export default VolcanicTroll;
