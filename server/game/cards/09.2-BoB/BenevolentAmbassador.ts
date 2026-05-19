import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class BenevolentAmbassador extends DrawCard {
    static id = 'benevolent-ambassador';

    setupCardAbilities() {
        this.reaction({
            title: 'Give both players honor',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            },
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.game.getPlayers()
            }))
        });
    }
}


export default BenevolentAmbassador;
