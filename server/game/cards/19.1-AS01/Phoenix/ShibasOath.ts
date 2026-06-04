import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { AbilityType, CardType, EventName, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityProps } from '../../../Interfaces.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class ShibasOath extends DrawCard {
    static id = 'shiba-s-oath';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            cardCondition: (card) => card.hasTrait('bushi')
        });

        this.reaction({
            title: 'Honor attached character',
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) =>
                    event.card === context.source && event.originalLocation !== Location.PlayArea
            },
            gameAction: AbilityDsl.actions.honor((context) => ({
                target: context.source.parent
            })),
            effect: 'honor {1}',
            effectArgs: (context) => context.source.parent as DrawCard
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.WouldInterrupt, {
                title: 'Cancel an ability',
                when: {
                    onInitiateAbilityEffects: (event, context) =>
                        (event.cardTargets as Array<BaseCard>).some(
                            (card) =>
                                // In play
                                card.location === Location.PlayArea &&
                                // Character
                                card.getType() === CardType.Character &&
                                // Friendly
                                card.controller === context.player &&
                                // Not a Bushi
                                !card.hasTrait('bushi')
                        )
                },
                cost: AbilityDsl.costs.sacrificeSelf(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cancel(),
                    AbilityDsl.actions.moveCard({
                        target: this,
                        destination: Location.Hand
                    })
                ]),
                effect: 'cancel the effects of {1} and return {2} to their hand',
                effectArgs: (context) => [context.event.card, this]
            } as TriggeredAbilityProps)
        });
    }
}
