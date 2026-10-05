import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoTogama extends DrawCard {
    static id = 'asako-togama';

    setupCardAbilities() {
        this.action('Switch a claimed ring with an unclaimed one')
            .condition(context => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.joint([
                AbilityDsl.actions.selectRing(context => ({
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: ring => ring.claimedBy === context.player.name,
                    message: '{0} returns the {1}',
                    messageArgs: ring => [context.player, ring],
                    gameAction: AbilityDsl.actions.returnRing()
                })),
                AbilityDsl.actions.selectRing(context => ({
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: ring => ring.isUnclaimed(),
                    message: '{0} takes the {1}',
                    messageArgs: ring => [context.player, ring],
                    gameAction: AbilityDsl.actions.takeRing({ takeFate: true })
                }))
            ]))
            .effect('switch a claimed ring with an unclaimed one');
    }
}


export default AsakoTogama;
