import DrawCard from '../../DrawCard.js';

class SeppunTruthseeker extends DrawCard {
    static id = 'seppun-truthseeker';

    override setupCardAbilities() {
        this.forcedInterrupt('Each player draws 2 cards')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .draw((context) => ({
                target: context.game.getPlayers(),
                amount: 2
            }))
            .chatText('make both players draw 2 cards');
    }
}


export default SeppunTruthseeker;
