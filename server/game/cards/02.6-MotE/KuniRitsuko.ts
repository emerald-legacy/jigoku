import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { removeFate } from '../../GameActions/GameActions.js';

class KuniRitsuko extends DrawCard {
    static id = 'kuni-ritsuko';

    override setupCardAbilities() {
        this.reaction('Remove a fate')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) && context.source.isDefending()
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, removeFate());
    }
}


export default KuniRitsuko;
