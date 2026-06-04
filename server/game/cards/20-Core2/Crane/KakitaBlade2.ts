import { AbilityType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class KakitaBlade2 extends DrawCard {
    static id = 'kakita-blade-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Take an action',
                when: {
                    onConflictStarted: (_event, context: TriggeredAbilityContext<DrawCard>) =>
                        context.source.isParticipating() && context.source.hasTrait('bushi')
                },
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilSelfPassPriority,
                    effect: [AbilityDsl.effects.gainActionPhasePriority(), AbilityDsl.effects.additionalAction()]
                })),
                effect: 'take an action at the start of the conflict'
            })
        });
    }
}
