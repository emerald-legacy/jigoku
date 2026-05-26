import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class InsightfulGatekeeper extends DrawCard {
    static id = 'insightful-gatekeeper';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating() && context.player.opponent !== undefined && context.player.opponent.getClaimedRings().length > context.player.getClaimedRings().length,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}


export default InsightfulGatekeeper;
