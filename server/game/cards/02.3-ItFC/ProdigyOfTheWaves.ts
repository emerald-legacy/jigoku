import DrawCard from '../../DrawCard.js';
import { Elements } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'prodigy-of-the-waves-water';

class ProdigyOfTheWaves extends DrawCard {
    static id = 'prodigy-of-the-waves';

    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: () => this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(),
            gameAction: AbilityDsl.actions.ready()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}


export default ProdigyOfTheWaves;
