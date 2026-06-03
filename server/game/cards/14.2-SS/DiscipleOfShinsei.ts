import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DiscipleOfShinsei extends DrawCard {
    static id = 'disciple-of-shinsei';

    setupCardAbilities() {
        this.interrupt({
            title: 'Discard an attachment',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Attachment,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}


export default DiscipleOfShinsei;


