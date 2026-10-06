import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { conditional, discardFromPlay, removeFate } from '../../GameActions/GameActions.js';

class AkodoMakoto extends DrawCard {
    static id = 'akodo-makoto';

    setupCardAbilities() {
        this.reaction('Remove fate/discard character')
            .when({
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => {
                    return card.hasTrait('courtier') && card.isParticipating();
                }
            }, conditional({
                condition: context => (context.target?.getFate() ?? 0) > 0,
                trueGameAction: removeFate(),
                falseGameAction: discardFromPlay()
            }));
    }
}


export default AkodoMakoto;
