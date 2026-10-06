import AbilityDsl from '../../../abilitydsl.js';
import { takeHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class BirdHelmAdjudicator extends DrawCard {
    static id = 'bird-helm-adjudicator';

    setupCardAbilities() {
        this.reaction('Make the opponent lose an honor')
            .when({
                onConflictPass: (event, context) =>
                    event.conflict.attackingPlayer === context.player && !!context.player.opponent
            })
            .gameAction(takeHonor())
            .max(AbilityDsl.limit.perRound(1));
    }
}
