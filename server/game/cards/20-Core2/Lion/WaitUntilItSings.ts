import AbilityDsl from '../../../abilitydsl.js';
import { additionalActionAfterWindowCompleted } from '../../../effects.js';
import { playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class WaitUntilItSings extends DrawCard {
    static id = 'wait-until-it-sings';

    setupCardAbilities() {
        this.action('Take an action during conflict resolution')
            .condition(context => context.game.currentConflict?.getParticipants().some((p) => p.controller === context.player && p.hasTrait('commander')) ?? false)
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player,
                effect: additionalActionAfterWindowCompleted(1)
            })))
            .effect('take an action before conflict resolution')
            .max(AbilityDsl.limit.perConflict(1));
    }
}
