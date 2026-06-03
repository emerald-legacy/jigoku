import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';

const elementKey = 'isawa-tsuke-2-fire';
class VolcanicTroll extends DrawCard {
    static id = 'volcanic-troll';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.rings[this.getCurrentElementSymbol(elementKey)].isUnclaimed(),
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Unclaimed Ring',
            element: Element.Fire
        });
        return symbols;
    }
}


export default VolcanicTroll;
