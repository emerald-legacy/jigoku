import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'reclusive-zokujin-earth';

class ReclusiveZokujin extends DrawCard {
    static id = 'reclusive-zokujin';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            effect: [
                AbilityDsl.effects.addKeyword('covert'),
                AbilityDsl.effects.immunity({
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Earth
        });
        return symbols;
    }
}


export default ReclusiveZokujin;
