import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MantisRaider extends DrawCard {
    static id = 'mantis-raider';

    public setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                onConflictStarted: (event, context) =>
                    context.source.isAttacking() && event.conflict.defenders.length === 0
            })
            .gameAction(AbilityDsl.actions.placeFate((context) => ({
                origin: context.player.opponent
            })))
            .effect('take a fate from {1} and place it on {0}.', (context) => context.player.opponent);

        this.action('Give this character +1 military')
            .cost(AbilityDsl.costs.removeFateFromSelf())
            .condition((context) => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            }))
            .effect('give himself +1{1}', () => ['military'])
            .limit(AbilityDsl.limit.perConflict(2));
    }
}
