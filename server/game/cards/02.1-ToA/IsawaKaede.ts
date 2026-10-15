import DrawCard from '../../DrawCard.js';
import { Element, RestrictionScope } from '../../Constants.js';
import { addElementAsAttacker, immunity, modifyConflictElementsToResolve } from '../../effects.js';

const elementKey = 'isawa-kaede-void';

class IsawaKaede extends DrawCard {
    static id = 'isawa-kaede';

    setupCardAbilities() {
        this.persistentEffect({
            effect: immunity({
                appliesTo: RestrictionScope.OpponentsRingEffects
            })
        });
        this.persistentEffect({
            effect: addElementAsAttacker(() => this.getCurrentElementSymbol(elementKey))
        });
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && this.game.currentConflict?.winner === context.player,
            effect: modifyConflictElementsToResolve(5)
        });
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Element to Add',
            element: Element.Void
        });
        return symbols;
    }
}


export default IsawaKaede;
