import { doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';

class ChikaiOrderProtector extends DrawCard {
    static id = 'chikai-order-protector';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && context.player.cardsInPlay.some((card) => card.type === CardType.Character && card.isParticipating() && (card.hasTrait(Trait.Courtier) || card.hasTrait(Trait.Shugenja))),
            effect: doesNotBow()
        });
    }
}


export default ChikaiOrderProtector;
