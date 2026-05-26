import { AbilityTypes, Durations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class KakitaBlade2 extends DrawCard {
    static id = 'kakita-blade-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Take an action',
                when: {
                    onConflictStarted: (_event: any, context: any) =>
                        context.source.isParticipating() && context.source.hasTrait('bushi')
                },
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Durations.UntilSelfPassPriority,
                    effect: [AbilityDsl.effects.gainActionPhasePriority(), AbilityDsl.effects.additionalAction()]
                })),
                effect: 'take an action at the start of the conflict'
            })
        });
    }
}
