import * as costs from '../../../costs/index.js';
import { resolveRingEffect } from '../../../GameActions/GameActions.js';
import { Element } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

const ELEMENT_TO_RETURN = 'firebrand-fire-cost';
const ELEMENT_TO_RESOLVE = 'firebrand-fire-ability';

export default class Firebrand extends DrawCard {
    static id = 'firebrand';

    public setupCardAbilities() {
        this.action('Resolve the fire ring')
            .cost(costs.returnRings(1, (ring) =>
                ring.hasElement(this.getCurrentElementSymbol(ELEMENT_TO_RETURN))
            ))
            .gameAction(resolveRingEffect((context) => ({
                player: context.player,
                target: context.game.rings[this.getCurrentElementSymbol(ELEMENT_TO_RESOLVE)]
            })))
            .chatText((context) => msg`resolve the ${context.game.rings.fire} effect`);
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
