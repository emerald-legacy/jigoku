import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiShigeru extends DrawCard {
    static id = 'doji-shigeru';

    setupCardAbilities(ability: typeof AbilityDsl) {
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
