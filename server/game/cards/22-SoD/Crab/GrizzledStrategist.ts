import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';

export default class GrizzledStrategist extends DrawCard {
    static id = 'grizzled-strategist';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });

        this.wouldInterrupt({
            title: 'Cancel an event',
            cost: AbilityDsl.costs.sacrifice({ cardType: CardType.Character }),
            when: {
                onInitiateAbilityEffects: (event, context) => context.game.isDuringConflict() &&
                    context.source.isParticipating() &&
                    event.card.type === CardType.Event
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
