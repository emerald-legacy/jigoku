import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Phase, CardType } from '../../Constants.js';

class KuniLaboratory extends DrawCard {
    static id = 'kuni-laboratory';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardType.Character,
            effect: modifyBothSkills(1)
        });

        this.forcedReaction('After the conflict phase begins')
            .when({
                onPhaseStarted: event => event.phase === Phase.Conflict
            })
            .loseHonor(context => ({ target: context.player }))
            .effect('lose an honor');
    }
}


export default KuniLaboratory;
