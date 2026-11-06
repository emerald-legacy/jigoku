import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class JadeInlaidKatana extends DrawCard {
    static id = 'jade-inlaid-katana';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Remove 1 fate from a character', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.isOnWinningSide(context.source)
                })
                .target({
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card) => {
                        return card.hasStatusTokens && card.isParticipating();
                    }
                }, removeFate()))
        });
    }
}


export default JadeInlaidKatana;
