import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';

class IkomaIkehata extends DrawCard {
    static id = 'ikoma-ikehata';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character and draw a card',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() && event.conflict.conflictType === 'political'
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}


export default IkomaIkehata;
