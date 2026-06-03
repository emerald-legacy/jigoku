import { AbilityType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityProps } from '../../../Interfaces.js';

export default class CollectorOfFavors extends DrawCard {
    static id = 'collector-of-favors';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'courtier' });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Gain 1 fate',
                when: {
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: AbilityDsl.actions.gainFate()
            } as TriggeredAbilityProps)
        });
    }
}
