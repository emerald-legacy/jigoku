import DrawCard from '../../DrawCard.js';
import { Players, CardType, Trait } from '../../Constants.js';
import { injure } from '../../GameActions/GameActions.js';

class AkodoMakoto extends DrawCard {
    static id = 'akodo-makoto';

    override setupCardAbilities() {
        this.reaction('Remove fate/discard character')
            .when({
                afterConflict: (event, context) => {
                    return event.conflict.isOnWinningSide(context.source);
                }
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => {
                    return card.hasTrait(Trait.Courtier) && card.isParticipating();
                }
            }, injure());
    }
}


export default AkodoMakoto;
