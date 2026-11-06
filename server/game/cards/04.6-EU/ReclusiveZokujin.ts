import DrawCard from '../../DrawCard.js';
import { Element, RestrictionScope } from '../../Constants.js';
import { addKeyword, immunity } from '../../effects.js';

const elementKey = 'reclusive-zokujin-earth';

class ReclusiveZokujin extends DrawCard {
    static id = 'reclusive-zokujin';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            effect: [
                addKeyword('covert'),
                immunity({
                    appliesTo: RestrictionScope.OpponentsCardEffects
                })
            ]
        });
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Earth
        }
    ];
}


export default ReclusiveZokujin;
