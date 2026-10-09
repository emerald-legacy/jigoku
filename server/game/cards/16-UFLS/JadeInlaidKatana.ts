import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class JadeInlaidKatana extends DrawCard {
    static id = 'jade-inlaid-katana';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Remove 1 fate from a character', {
                afterConflict: (event, context) =>
                    context.source.isParticipating() && event.conflict.winner === context.source.controller
            }, (ability) => ability
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
