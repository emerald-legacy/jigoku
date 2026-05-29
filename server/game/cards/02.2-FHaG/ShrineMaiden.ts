import DrawCard from '../../DrawCard.js';
import { EventNames, Locations } from '../../Constants.js';
import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShrineMaiden extends DrawCard {
    static id = 'shrine-maiden';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Reveal your top 3 conflict cards',
            when: {
                onCharacterEntersPlay: (event: EventPayload<EventNames.OnCharacterEntersPlay>, context: TriggeredAbilityContext) => event.card === context.source
            },
            cost: ability.costs.reveal((context: AbilityContext) => context.player.conflictDeck.slice(0, 3)),
            effect: 'take any revealed spells into their hand',
            handler: (context: TriggeredAbilityContext) => {
                const cards = context.player.conflictDeck.slice(0, 3);
                const toHand = cards.filter((card: any) => card.hasTrait('kiho') || card.hasTrait('spell'));
                const toDiscard = cards.filter((card: any) => !card.hasTrait('kiho') && !card.hasTrait('spell'));

                toHand.forEach((card: any) => {
                    context.player.moveCard(card, Locations.Hand);
                });

                toDiscard.forEach((card: any) => {
                    context.player.moveCard(card, Locations.ConflictDiscardPile);
                });

                if(toHand.length && toDiscard.length) {
                    this.game.addMessage('{0} adds {1} to their hand and discards {2}', context.player, toHand, toDiscard);
                } else if(toHand.length) {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, toHand);
                } else {
                    this.game.addMessage('{0} discards {1}', context.player, toDiscard);
                }
            }
        });
    }
}


export default ShrineMaiden;
