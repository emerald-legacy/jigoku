import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class OutskirtsSentry extends DrawCard {
    static id = 'outskirts-sentry';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Honor a participating character',
            when: {
                onMoveToConflict: (_event: any, context: any) => context.source.isParticipating()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default OutskirtsSentry;
