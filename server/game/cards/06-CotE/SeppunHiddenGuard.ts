import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SeppunHiddenGuard extends DrawCard {
    static id = 'seppun-hidden-guard';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardTypes.Character &&
                    event.cardTargets.some(
                        (card) =>
                            card.isUnique() &&
                            card.controller === context.player &&
                            card.location === Locations.PlayArea
                    )
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}, and force {2} to discard a card at random',
            effectArgs: (context) => [context.event.card, context.event.context.player],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.discardAtRandom((context) => ({ target: context.event.context.player }))
            ])
        });
    }
}


export default SeppunHiddenGuard;
