import { draw, honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';

class IkomaIkehata extends DrawCard {
    static id = 'ikoma-ikehata';

    setupCardAbilities() {
        this.reaction('Honor a character and draw a card')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() && event.conflict.conflictType === ConflictType.Political
            })
            .target({
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character,
                controller: Players.Self
            }, honor())
            .gameAction(draw());
    }
}


export default IkomaIkehata;
