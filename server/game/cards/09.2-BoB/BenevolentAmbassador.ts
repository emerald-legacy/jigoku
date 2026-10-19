import DrawCard from '../../DrawCard.js';

class BenevolentAmbassador extends DrawCard {
    static id = 'benevolent-ambassador';

    override setupCardAbilities() {
        this.reaction('Give both players honor')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .gainHonor((context) => ({
                target: context.game.getPlayers()
            }));
    }
}


export default BenevolentAmbassador;
