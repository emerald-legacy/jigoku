import DrawCard from '../../DrawCard.js';

class BenevolentAmbassador extends DrawCard {
    static id = 'benevolent-ambassador';

    setupCardAbilities() {
        this.reaction('Give both players honor')
            .when({
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            })
            .gainHonor((context) => ({
                target: context.game.getPlayers()
            }));
    }
}


export default BenevolentAmbassador;
