import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';

const elementKey = 'isawa-kaede-void';

export default class IsawaKaede extends DrawCard {
    static id = 'isawa-kaede';

    setupCardAbilities() {
        this.ability
            .constant()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [$modifier.immuneTo('opponentsRingEffects')])
            .addPrinted();

        this.ability
            .constant()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [$modifier.addElementAsAttacker((source) => source.getCurrentElementSymbol(elementKey))])
            .addPrinted();

        this.ability
            .constant()
            .while((ctx) => ctx.source.isAttacking() && ctx.conflict?.winner === ctx.player)
            .appliesTo(($subject) => $subject.conflict())
            .modifiers(($modifier) => [$modifier.conflictElementsToResolve(5)])
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
