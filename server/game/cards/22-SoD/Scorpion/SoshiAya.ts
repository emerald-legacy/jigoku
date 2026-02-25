import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SoshiAya extends DrawCard {
    static id = 'soshi-aya';
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.card.type === CardTypes.Character &&
                    event.card.hasTrait('courtier') && event.card.controller === context.player.opponent &&
                    context.event.context.ability.printedAbility
            },
            cost: AbilityDsl.costs.putSelfIntoPlay(),
            then: {
                gameAction: AbilityDsl.actions.placeFate()
            },
            location: Locations.Hand,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
