import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKey = 'kudaka-air';

class Kudaka extends DrawCard {
    static id = 'kudaka';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate and draw 1 card',
            limit: AbilityDsl.limit.perRound(2),
            effect: 'gain 1 fate and draw 1 card',
            when: {
                onClaimRing: (event, context) => {
                    const elem = this.getCurrentElementSymbol(elementKey);
                    if(elem === 'none') {
                        return false;
                    }
                    return ((event.conflict && event.conflict.hasElement(elem)) || event.ring.hasElement(elem)) && event.player === context.player;
                }
            },
            gameAction: [AbilityDsl.actions.gainFate(), AbilityDsl.actions.draw()]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        return symbols;
    }
}


export default Kudaka;
