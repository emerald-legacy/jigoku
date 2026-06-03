import DrawCard from '../../DrawCard.js';
import { CardType, Element, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
const elementKey = 'isawa-ujina-void';

class IsawaUjina extends DrawCard {
    static id = 'isawa-ujina';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Remove a character from the game',
            when: {
                onClaimRing: (event: EventPayload<EventName.OnClaimRing>) => {
                    const element = this.getCurrentElementSymbol(elementKey) || Element.Void;
                    return (event.conflict && event.conflict.ring && event.conflict.ring.hasElement(element)) || event.ring.hasElement(element);
                }
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card: any) => card.getFate() === 0,
                gameAction: AbilityDsl.actions.removeFromGame()
            },
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Element.Void
        });
        return symbols;
    }
}


export default IsawaUjina;
