import DrawCard from '../../DrawCard.js';

class DaidojiIronWarrior extends DrawCard {
    static id = 'daidoji-iron-warrior';

    override setupCardAbilities() {
        this.reaction('Force each player to discard to 4 cards')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .chosenDiscard((context) => ({
                target: context.player.opponent,
                amount: Math.max(0, (context.player.opponent?.hand.length ?? 0) - 4)
            }))
            .chosenDiscard((context) => ({
                target: context.player,
                amount: Math.max(0, context.player.hand.length - 4)
            }))
            .chatText('make both players discard down to 4 cards');
    }
}


export default DaidojiIronWarrior;
