import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class DojiShigeru extends DrawCard {
    static id = 'doji-shigeru';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Opponent discards a card',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardTypes.Event &&
                                                  context.source.isParticipating()
            },
            gameAction: ability.actions.chosenDiscard()
        });
    }
}


export default DojiShigeru;
