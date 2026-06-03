import AbilityDsl from '../../../abilitydsl.js';
import { Element } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const ELEMENT_TO_RETURN = 'firebrand-fire-cost';
const ELEMENT_TO_RESOLVE = 'firebrand-fire-ability';

export default class Firebrand extends DrawCard {
    static id = 'firebrand';

    public setupCardAbilities() {
        this.action({
            title: 'Resolve the fire ring',
            cost: AbilityDsl.costs.returnRings(1, (ring) =>
                ring.hasElement(this.getCurrentElementSymbol(ELEMENT_TO_RETURN))
            ),
            gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({
                player: context.player,
                target: context.game.rings[this.getCurrentElementSymbol(ELEMENT_TO_RESOLVE)]
            })),
            effect: 'resolve the {1} effect',
            effectArgs: (context) => [context.game.rings.fire]
        });
    }

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_TO_RETURN,
            prettyName: 'Ring to return',
            element: Element.Fire
        });
        symbols.push({
            key: ELEMENT_TO_RESOLVE,
            prettyName: 'Ring to resolve',
            element: Element.Fire
        });
        return symbols;
    }
}
