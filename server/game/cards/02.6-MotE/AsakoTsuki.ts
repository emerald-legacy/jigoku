import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Element, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
const elementKey = 'asako-tsuki-water';

class AsakoTsuki extends DrawCard {
    static id = 'asako-tsuki';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a scholar character',
            when: {
                onClaimRing: (event: EventPayload<EventName.OnClaimRing>) => (event.conflict && event.conflict.hasElement(this.getCurrentElementSymbol(elementKey) as Element)) || event.ring.hasElement(this.getCurrentElementSymbol(elementKey) as Element)
            },
            target: {
                cardType: CardType.Character,
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
            element: Element.Water
        });
        return symbols;
    }
}


export default AsakoTsuki;
