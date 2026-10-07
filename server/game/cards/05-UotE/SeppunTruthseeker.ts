import DrawCard from '../../DrawCard.js';

class SeppunTruthseeker extends DrawCard {
    static id = 'seppun-truthseeker';

    setupCardAbilities() {
        this.forcedInterrupt('Each player draws 2 cards')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .draw((context) => ({
                target: context.game.getPlayers(),
                amount: 2
            }))
            .effect('make both players draw 2 cards');
    }
}


export default SeppunTruthseeker;
