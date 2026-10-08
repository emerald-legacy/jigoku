import * as costs from '../../../costs/index.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
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
            .placeFate((context) => ({
                origin: context.player.opponent
            }))
            .chatText((context) => msg`take a fate from ${context.player.opponent} and place it on ${context.chatTarget()}`);

        this.conflictAction('Give this character +1 military')
            .cost(costs.removeFateFromSelf())
            .cardLastingEffect({
                effect: modifyMilitarySkill(1)
            })
            .chatText(() => msg`give himself +1${'military'}`)
            .limit(perConflict(2));
    }
}
