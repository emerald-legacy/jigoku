import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardCannot } from '../../effects.js';
import { bow, cardLastingEffect, multiple } from '../../GameActions/GameActions.js';

class KaitoNobukai extends DrawCard {
    static id = 'kaito-nobukai';

    setupCardAbilities() {
        this.action('Bow each participating characters')
            .cost(costs.sacrificeSelf())
            .condition(context => context.source.isParticipating())
            .gameAction(multiple([
                bow(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardType.Character && card.isParticipating())
                })),
                cardLastingEffect(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardType.Character),
                    effect: cardCannot('moveToConflict')
                }))
            ]))
            .effect('bow all participating characters and prevent characters from moving into this conflict');
    }
}

export default KaitoNobukai;
