import DrawCard from '../../drawcard.js';
import { Phases, CardTypes } from '../../Constants.js';

class KuniLaboratory extends DrawCard {
    static id = 'kuni-laboratory';

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character,
            effect: ability.effects.modifyBothSkills(1)
        });

        this.forcedReaction({
            title: 'After the conflict phase begins',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'lose an honor',
            gameAction: ability.actions.loseHonor(context => ({ target: context.player }))
        });
    }
}


export default KuniLaboratory;
