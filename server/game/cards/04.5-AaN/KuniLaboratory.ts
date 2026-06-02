import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Phases, CardType } from '../../Constants.js';

class KuniLaboratory extends DrawCard {
    static id = 'kuni-laboratory';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardType.Character,
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.forcedReaction({
            title: 'After the conflict phase begins',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'lose an honor',
            gameAction: AbilityDsl.actions.loseHonor(context => ({ target: context.player }))
        });
    }
}


export default KuniLaboratory;
