import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class OutskirtsSentry extends DrawCard {
    static id = 'outskirts-sentry';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a participating character',
            when: {
                onMoveToConflict: (event, context) => context.source.isParticipating()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default OutskirtsSentry;
