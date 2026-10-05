import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiShigeru extends DrawCard {
    static id = 'doji-shigeru';

    setupCardAbilities() {
        this.reaction('Opponent discards a card')
            .when({
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardType.Event &&
                                                  context.source.isParticipating()
            })
            .gameAction(AbilityDsl.actions.chosenDiscard())
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default DojiShigeru;
