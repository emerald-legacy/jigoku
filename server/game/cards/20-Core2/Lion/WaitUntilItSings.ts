import { Durations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class WaitUntilItSings extends DrawCard {
    static id = 'wait-until-it-sings';

    setupCardAbilities() {
        this.action({
            title: 'Take an action during conflict resolution',
            condition: context => context.game.currentConflict.getParticipants().some(p => p.controller === context.player && p.hasTrait('commander')),
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.additionalActionAfterWindowCompleted(1)
            })),
            effect: 'take an action before conflict resolution',
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
