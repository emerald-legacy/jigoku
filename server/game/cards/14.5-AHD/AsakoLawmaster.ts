import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoLawmaster extends DrawCard {
    static id = 'asako-lawmaster';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain an honor',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            },
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player
            }))
        });
    }
}


export default AsakoLawmaster;
