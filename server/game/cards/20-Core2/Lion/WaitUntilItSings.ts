import { Trait } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { additionalActionAfterWindowCompleted } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class WaitUntilItSings extends DrawCard {
    static id = 'wait-until-it-sings';

    override setupCardAbilities() {
        this.conflictAction('Take an action during conflict resolution')
            .ifCondition((context) => context.game.currentConflict?.getParticipants().some((p) => p.controller === context.player && p.hasTrait(Trait.Commander)) ?? false)
            .playerLastingEffect({
                effect: additionalActionAfterWindowCompleted(1)
            })
            .chatText('take an action before conflict resolution')
            .max(perConflict(1));
    }
}
