import { CardType, Element, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class MantraOfFire extends DrawCard {
    static id = 'mantra-of-fire';

    setupCardAbilities() {
        this.reaction('Add 1 fate to a monk and draw a card')
            .when({
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) =>
                    event.ring?.hasElement(Element.Fire) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card =>
                    card.hasTrait('monk') || card.attachments.some((card: DrawCard) => card.hasTrait('monk'))
            }, AbilityDsl.actions.placeFate())
            .gameAction(AbilityDsl.actions.draw())
            .effect('add a fate to {0} and draw a card');
    }
}
