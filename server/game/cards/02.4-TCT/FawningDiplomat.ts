import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class FawningDiplomat extends DrawCard {
    static id = 'fawning-diplomat';

    setupCardAbilities() {
        this.interrupt({
            title: 'Claim Imperial favor',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            effect: 'claim the Emperor\'s favor as she leaves play',
            gameAction: AbilityDsl.actions.claimImperialFavor(context => ({
                target: context.player
            }))
        });
    }
}


export default FawningDiplomat;
