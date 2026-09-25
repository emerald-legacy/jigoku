import { CardType, EventName, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class MantraOfEarth extends DrawCard {
    static id = 'mantra-of-earth';

    setupCardAbilities() {
        this.reaction('Make a monk untargetable by opponents\' card effects and draw a card')
            .when({
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) =>
                    event.ring?.hasElement('earth' as Element) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card: DrawCard) => card.hasTrait('monk'))
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .gameAction(AbilityDsl.actions.draw())
            .effect('make {0} untargetable by opponents\' card effects and draw a card');
    }
}
