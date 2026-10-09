import { Duration } from '../../../Constants.js';
import { additionalAction, gainAbility, gainActionPhasePriority } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class KakitaBlade2 extends DrawCard {
    static id = 'kakita-blade-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Take an action', {
                onConflictStarted: (_event, context) =>
                    context.source.isParticipating() && context.source.hasTrait('bushi')
            }, (ability) => ability
                .playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilSelfPassPriority,
                    effect: [gainActionPhasePriority(), additionalAction()]
                }))
                .chatText('take an action at the start of the conflict'))
        });
    }
}
