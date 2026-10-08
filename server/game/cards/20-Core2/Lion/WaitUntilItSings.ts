import { perConflict } from '../../../AbilityLimit.js';
import { additionalActionAfterWindowCompleted } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class WaitUntilItSings extends DrawCard {
    static id = 'wait-until-it-sings';

    setupCardAbilities() {
        this.action('Take an action during conflict resolution')
            .condition((context) => context.game.currentConflict?.getParticipants().some((p) => p.controller === context.player && p.hasTrait('commander')) ?? false)
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: additionalActionAfterWindowCompleted(1)
            }))
            .chatText('take an action before conflict resolution')
            .max(perConflict(1));
    }
}
