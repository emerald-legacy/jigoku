import DrawCard from '../../DrawCard.js';
import { Element, RestrictionScope } from '../../Constants.js';
import { addElementAsAttacker, immunity, modifyConflictElementsToResolve } from '../../effects.js';

const elementKey = 'isawa-kaede-void';

class IsawaKaede extends DrawCard {
    static id = 'isawa-kaede';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: immunity({
                appliesTo: RestrictionScope.OpponentsRingEffects
            })
        });
        this.persistentEffect({
            effect: addElementAsAttacker(() => this.getCurrentElementSymbol(elementKey))
        });
        this.persistentEffect({
            // sent home after the winner was determined (False Loyalties), she still won as an attacker
            condition: (context) => !!this.game.currentConflict?.wonAsAttacker(context.source),
            effect: modifyConflictElementsToResolve(5)
        });
    }

    override getPrintedElementSymbols() {
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
