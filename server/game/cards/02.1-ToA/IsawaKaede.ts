import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'isawa-kaede-void';

class IsawaKaede extends DrawCard {
    static id = 'isawa-kaede';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsRingEffects'
            })
        });
        this.persistentEffect({
            effect: AbilityDsl.effects.addElementAsAttacker(() => this.getCurrentElementSymbol(elementKey))
        });
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict?.winner === context.player,
            effect: AbilityDsl.effects.modifyConflictElementsToResolve(5)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Element to Add',
            element: Element.Void
        });
        return symbols;
    }
}


export default IsawaKaede;
