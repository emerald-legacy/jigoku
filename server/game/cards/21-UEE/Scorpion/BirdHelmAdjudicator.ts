import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BirdHelmAdjudicator extends DrawCard {
    static id = 'bird-helm-adjudicator';

    setupCardAbilities() {
        this.reaction({
            title: 'Make the opponent lose a honor',
            when: {
                onConflictPass: (event, context) =>
                    event.conflict.attackingPlayer === context.player && context.player.opponent !== null
            },
            gameAction: AbilityDsl.actions.takeHonor(),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
