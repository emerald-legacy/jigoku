import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class KuniPurifier extends DrawCard {
    static id = 'kuni-purifier';

    setupCardAbilities() {
        this.reaction({
            title: 'Make opponent lose honor',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: AbilityDsl.actions.discardAtRandom()
        });
    }
}


export default KuniPurifier;
