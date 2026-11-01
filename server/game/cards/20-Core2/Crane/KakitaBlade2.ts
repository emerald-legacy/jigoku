import { Duration, Trait } from '../../../Constants.js';
import { additionalAction, gainAbility, gainActionPhasePriority } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class KakitaBlade2 extends DrawCard {
    static id = 'kakita-blade-2';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Take an action', (ability) => ability
                .when({
                    onConflictStarted: (_event, context) =>
                        context.source.isParticipating() && context.source.hasTrait(Trait.Bushi)
                })
                .playerLastingEffect({
                    duration: Duration.UntilSelfPassPriority,
                    effect: [gainActionPhasePriority(), additionalAction()]
                })
                .chatText('take an action at the start of the conflict'))
        });
    }
}
