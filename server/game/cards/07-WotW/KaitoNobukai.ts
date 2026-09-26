import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaitoNobukai extends DrawCard {
    static id = 'kaito-nobukai';

    setupCardAbilities() {
        this.action('Bow each participating characters')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.bow(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardType.Character && card.isParticipating())
                })),
                AbilityDsl.actions.cardLastingEffect(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardType.Character),
                    effect: AbilityDsl.effects.cardCannot('moveToConflict')
                }))
            ]))
            .effect('bow all participating characters and prevent characters from moving into this conflict');
    }
}

export default KaitoNobukai;
