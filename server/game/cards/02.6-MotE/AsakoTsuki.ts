import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Elements, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
const elementKey = 'asako-tsuki-water';

class AsakoTsuki extends DrawCard {
    static id = 'asako-tsuki';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a scholar character',
            when: {
                onClaimRing: (event: EventPayload<EventNames.OnClaimRing>) => (event.conflict && event.conflict.hasElement(this.getCurrentElementSymbol(elementKey) as Elements)) || event.ring.hasElement(this.getCurrentElementSymbol(elementKey) as Elements)
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.hasTrait('scholar'),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}


export default AsakoTsuki;
