import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';

const elementKey = 'isawa-kaede-void';

export default class IsawaKaede extends DrawCard {
    static id = 'isawa-kaede';

    setupCardAbilities() {
        this.ability
            .constant()
            .affects(($a) => $a.self())
            .effects(($mod) => [$mod.immuneTo('opponentsRingEffects')])
            .addPrinted();

        this.ability
            .constant()
            .affects(($a) => $a.self())
            .effects(($mod) => [$mod.addElementAsAttacker((source) => source.getCurrentElementSymbol(elementKey))])
            .addPrinted();

        this.ability
            .constant()
            .while((ctx) => ctx.source.isAttacking() && ctx.conflict?.winner === ctx.player)
            .affects(($a) => $a.conflict())
            .effects(($mod) => [$mod.conflictElementsToResolve(5)])
            .addPrinted();
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
