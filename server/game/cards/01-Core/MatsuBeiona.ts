import DrawCard from '../../DrawCard.js';

class MatsuBeiona extends DrawCard {
    static id = 'matsu-beiona';

    setupCardAbilities() {
        this.reaction('Put 2 fate on this character')
            .when({
                onCharacterEntersPlay: (event, context) => (
                    event.card === context.source &&
                    context.player.cardsInPlay.filter(card => (
                        card.hasTrait('bushi') &&
                        card !== context.source
                    )).length >= 3
                )
            })
            .placeFate({ amount: 2 });
    }
}


export default MatsuBeiona;
