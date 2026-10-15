import * as costs from '../../../costs/index.js';
import { reduceCost } from '../../../effects.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class IuchiTadamatsu extends DrawCard {
    static id = 'iuchi-tadamatsu';

    setupCardAbilities() {
        this.persistentEffect({
            effect: reduceCost({
                match: (card) => card.hasTrait('meishodo'),
                targetCondition: (target, source) => target === source
            })
        });

        this.action('Ready this character')
            .cost(costs.sacrifice({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parentCharacter === context.source
            }))
            .ready();
    }
}
