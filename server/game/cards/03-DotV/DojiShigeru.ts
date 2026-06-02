import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiShigeru extends DrawCard {
    static id = 'doji-shigeru';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Opponent discards a card',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardType.Event &&
                                                  context.source.isParticipating()
            },
            gameAction: ability.actions.chosenDiscard()
        });
    }
}


export default DojiShigeru;
