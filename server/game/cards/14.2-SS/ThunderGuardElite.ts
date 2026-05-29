import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ThunderGuardElite extends DrawCard {
    static id = 'thunder-guard-elite';

    setupCardAbilities() {
        this.action({
            title: 'Opponent discards a random card',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.discardAtRandom(context => ({
                target: context.player.opponent
            }))
        });
    }
}


export default ThunderGuardElite;


