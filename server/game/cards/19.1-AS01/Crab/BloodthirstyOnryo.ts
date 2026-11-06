import { msg } from '../../../GameChat.js';
import { CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { removeFromGameInsteadOfLeavingPlay } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class BloodthirstyOnryo extends DrawCard {
    static id = 'bloodthirsty-onryo';

    public override setupCardAbilities() {
        this.persistentEffect({
            effect: removeFromGameInsteadOfLeavingPlay({
                message: (card) => msg`${card} is removed from the game due to leaving play`
            })
        });

        this.action('Put this into play')
            .location([Location.Provinces, Location.DynastyDiscardPile])
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .putIntoPlay();
    }
}
