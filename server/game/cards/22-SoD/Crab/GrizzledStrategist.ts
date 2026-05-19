import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';
import { CardTypes } from '../../../Constants.js';

export default class GrizzledStrategist extends DrawCard {
    static id = 'grizzled-strategist';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });

        this.wouldInterrupt({
            title: 'Cancel an event',
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            when: {
                onInitiateAbilityEffects: (event, context) => context.game.isDuringConflict() &&
                    context.source.isParticipating() &&
                    event.card.type === CardTypes.Event
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
