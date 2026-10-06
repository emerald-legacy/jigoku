import AbilityDsl from '../../../abilitydsl.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class MantisRaider extends DrawCard {
    static id = 'mantis-raider';

    public setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                onConflictStarted: (event, context) =>
                    context.source.isAttacking() && event.conflict.defenders.length === 0
            })
            .gameAction(placeFate((context) => ({
                origin: context.player.opponent
            })))
            .effect('take a fate from {1} and place it on {0}', (context) => context.player.opponent);

        this.conflictAction('Give this character +1 military')
            .cost(AbilityDsl.costs.removeFateFromSelf())
            .gameAction(cardLastingEffect({
                effect: modifyMilitarySkill(1)
            }))
            .effect(() => msg`give himself +1${'military'}`)
            .limit(AbilityDsl.limit.perConflict(2));
    }
}
