import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class WrathstormDancer extends DrawCard {
    static id = 'wrathstorm-dancer';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.source.isParticipating() &&
                (context.player.cardsInPlay as DrawCard[]).some(
                    (card) => card.hasTrait('berserker') && card !== context.source && card.isParticipating()
                ),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
