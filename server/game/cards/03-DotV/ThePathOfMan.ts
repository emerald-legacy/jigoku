import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ThePathOfMan extends DrawCard {
    static id = 'the-path-of-man';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                afterConflict: (event: any, context) => event.conflict.winner === context.player && event.conflict.skillDifference >= 5
            },
            gameAction: ability.actions.gainFate({ amount: 2 })
        });
    }
}


export default ThePathOfMan;
