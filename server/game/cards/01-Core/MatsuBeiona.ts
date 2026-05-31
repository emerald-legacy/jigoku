import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MatsuBeiona extends DrawCard {
    static id = 'matsu-beiona';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Put 2 fate on this character',
            when: {
                onCharacterEntersPlay: (event, context) => (
                    event.card === context.source &&
                    context.player.cardsInPlay.filter(card => (
                        card.hasTrait('bushi') &&
                        card !== context.source
                    )).length >= 3
                )
            },
            gameAction: ability.actions.placeFate({ amount: 2 })
        });
    }
}


export default MatsuBeiona;
