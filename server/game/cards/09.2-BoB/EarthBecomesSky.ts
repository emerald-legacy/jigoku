import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class EarthBecomesSky extends DrawCard {
    static id = 'earth-becomes-sky';

    setupCardAbilities() {
        this.reaction('Bow a character that just readied')
            .when({
                onCardReadied: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent
            })
            .bow((context) => ({ target: context.event.card }));
    }
}


export default EarthBecomesSky;
