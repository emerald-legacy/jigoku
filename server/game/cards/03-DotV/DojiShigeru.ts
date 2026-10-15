import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { unlimited } from '../../AbilityLimit.js';

class DojiShigeru extends DrawCard {
    static id = 'doji-shigeru';

    override setupCardAbilities() {
        this.reaction('Opponent discards a card')
            .when({
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardType.Event &&
                                                  context.source.isParticipating()
            })
            .chosenDiscard()
            .limit(unlimited());
    }
}


export default DojiShigeru;
