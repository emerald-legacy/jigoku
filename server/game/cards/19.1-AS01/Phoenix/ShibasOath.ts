import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { gainAbility } from '../../../effects.js';
import { CardType, Location, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibasOath extends DrawCard {
    static id = 'shiba-s-oath';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            cardCondition: (card) => card.hasTrait(Trait.Bushi)
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
            effect: gainAbility.wouldInterrupt('Cancel an ability', (ability) => ability
                .when({
                    onInitiateAbilityEffects: (event, context) =>
                        event.context.player === context.player.opponent &&
                        event.cardTargets.some(
                            (card) =>
                                // In play
                                card.location === Location.PlayArea &&
                                // Character
                                card.type === CardType.Character &&
                                // Friendly
                                card.controller === context.player &&
                                // Not a Bushi
                                !card.hasTrait(Trait.Bushi)
                        )
                })
                .cost(costs.sacrificeSelf())
                .cancel()
                .moveCard({
                    target: this,
                    destination: Location.Hand
                })
                .chatText((context) => msg`cancel the effects of ${context.event.card} and return ${this} to their hand`))
        });
    }
}
