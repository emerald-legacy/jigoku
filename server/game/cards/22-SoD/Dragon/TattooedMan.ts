import DrawCard from '../../../DrawCard.js';
import { Stage } from '../../../Constants.js';

export default class TattooedMan extends DrawCard {
    static id = 'tattooed-man';

    override setupCardAbilities() {
        this.reaction('Ready this character')
            .when({
                onMoveFate: (event, context) =>
                    (event.fate ?? 0) > 0 &&
                    event.recipient?.type === 'ring' &&
                    !!event.context &&
                    context.player === event.context.player &&
                    event.context.ability.isCardAbility() &&
                    // costs are not effects
                    event.context.stage !== Stage.Cost
            })
            .ready();
    }
}
