import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class ChikaiOrderProtector extends DrawCard {
    static id = 'chikai-order-protector';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending() && context.player.cardsInPlay.some(card => card.getType() === CardType.Character && card.isParticipating() && (card.hasTrait('courtier') || card.hasTrait('shugenja'))),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default ChikaiOrderProtector;
