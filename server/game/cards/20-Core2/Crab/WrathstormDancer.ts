import { Trait } from '../../../Constants.js';
import { doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class WrathstormDancer extends DrawCard {
    static id = 'wrathstorm-dancer';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.source.isParticipating() &&
                context.player.cardsInPlay.some(
                    (card) => card.hasTrait(Trait.Berserker) && card !== context.source && card.isParticipating()
                ),
            effect: doesNotBow()
        });
    }
}
