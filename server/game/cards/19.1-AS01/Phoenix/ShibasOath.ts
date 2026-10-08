import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { gainAbility } from '../../../effects.js';
import { cancel, moveCard, multiple } from '../../../GameActions/GameActions.js';
import { AbilityType, CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibasOath extends DrawCard {
    static id = 'shiba-s-oath';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            cardCondition: (card) => card.hasTrait('bushi')
        });

        this.reaction('Honor attached character')
            .when({
                onCardAttached: (event, context) =>
                    event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .honor((context) => ({
                target: context.source.parentCharacter ?? []
            }))
            .chatText((context) => msg`honor ${context.source.parentCharacter}`);

        this.whileAttached({
            effect: gainAbility(AbilityType.WouldInterrupt, {
                title: 'Cancel an ability',
                when: {
                    onInitiateAbilityEffects: (event, context) =>
                        event.cardTargets.some(
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
                cost: costs.sacrificeSelf(),
                gameAction: multiple([
                    cancel(),
                    moveCard({
                        target: this,
                        destination: Location.Hand
                    })
                ]),
                chatText: 'cancel the effects of {1} and return {2} to their hand',
                chatTextArgs: (context) => [context.event.card, this]
            })
        });
    }
}
