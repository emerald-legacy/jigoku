import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class OutskirtsSentry extends DrawCard {
    static id = 'outskirts-sentry';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Honor a participating character')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, ability.actions.honor());
    }
}


export default OutskirtsSentry;
