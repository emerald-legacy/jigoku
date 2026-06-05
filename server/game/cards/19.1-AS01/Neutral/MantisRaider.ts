import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class MantisRaider extends DrawCard {
    static id = 'mantis-raider';

    public setupCardAbilities() {
        this.reaction({
            title: 'Steal a fate',
            when: {
                onConflictStarted: (event, context) =>
                    context.source.isAttacking() && event.conflict.defenders.length === 0
            },
            effect: 'take a fate from {1} and place it on {0}.',
            effectArgs: (context) => context.player.opponent as Player,
            gameAction: AbilityDsl.actions.placeFate((context) => ({
                origin: context.player.opponent
            }))
        });

        this.action({
            title: 'Give this character +1 military',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.removeFateFromSelf(),
            effect: 'give himself +1{1}',
            effectArgs: () => ['military'],
            gameAction: AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            }),
            limit: AbilityDsl.limit.perConflict(2)
        });
    }
}
