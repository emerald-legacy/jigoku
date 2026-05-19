import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class ChikaiOrderProtector extends DrawCard {
    static id = 'chikai-order-protector';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending() && context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.isParticipating() && (card.hasTrait('courtier') || card.hasTrait('shugenja'))),
            effect: ability.effects.doesNotBow()
        });
    }
}


export default ChikaiOrderProtector;
