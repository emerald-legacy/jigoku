import DrawCard from '../../DrawCard.js';
import { CardType, RestrictionType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardCannot } from '../../effects.js';

class KaitoNobukai extends DrawCard {
    static id = 'kaito-nobukai';

    override setupCardAbilities() {
        this.action('Bow each participating character')
            .condition((context) => context.source.isParticipating())
            .cost(costs.sacrificeSelf())
            .bow(() => ({
                target: this.game.findAnyCardsInPlay((card) => card.type === CardType.Character && card.isParticipating())
            }))
            .cardLastingEffect(() => ({
                target: this.game.findAnyCardsInPlay((card) => card.type === CardType.Character),
                effect: cardCannot(RestrictionType.MoveToConflict)
            }))
            .chatText('bow all participating characters and prevent characters from moving into this conflict');
    }
}

export default KaitoNobukai;
