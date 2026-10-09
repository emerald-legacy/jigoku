import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';

class CunningConfidant extends DrawCard {
    static id = 'cunning-confidant';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating() && context.player.opponent !== undefined && context.player.opponent.getClaimedRings().length > context.player.getClaimedRings().length,
            effect: modifyPoliticalSkill(2)
        });
    }
}


export default CunningConfidant;
