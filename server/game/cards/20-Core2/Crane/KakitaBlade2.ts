import { AbilityType, Duration } from '../../../Constants.js';
import { additionalAction, gainAbility, gainActionPhasePriority } from '../../../effects.js';
import { playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KakitaBlade2 extends DrawCard {
    static id = 'kakita-blade-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Take an action',
                when: {
                    onConflictStarted: (_event, context) =>
                        context.source.isParticipating() && context.source.hasTrait('bushi')
                },
                gameAction: playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilSelfPassPriority,
                    effect: [gainActionPhasePriority(), additionalAction()]
                })),
                effect: 'take an action at the start of the conflict'
            })
        });
    }
}
