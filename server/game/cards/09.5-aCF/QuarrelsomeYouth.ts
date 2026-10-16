import DrawCard from '../../DrawCard.js';

class QuarrelsomeYouth extends DrawCard {
    static id = 'quarrelsome-youth';

    override setupCardAbilities() {
        this.reaction('Force opponent to discard a card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player &&
                    context.source.isAttacking() &&
                    context.player.opponent &&
                    context.player.hand.length < context.player.opponent.hand.length
            })
            .discardAtRandom();
    }
}


export default QuarrelsomeYouth;
