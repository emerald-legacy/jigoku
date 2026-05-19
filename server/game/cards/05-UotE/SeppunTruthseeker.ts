import DrawCard from '../../drawcard.js';

class SeppunTruthseeker extends DrawCard {
    static id = 'seppun-truthseeker';

    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Each player draws 2 cards',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            effect: 'make both players draw 2 cards',
            gameAction: ability.actions.draw(context => ({
                target: context.game.getPlayers(),
                amount: 2
            }))
        });
    }
}


export default SeppunTruthseeker;
