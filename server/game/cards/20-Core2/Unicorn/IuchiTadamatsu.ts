import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class IuchiTadamatsu extends DrawCard {
    static id = 'iuchi-tadamatsu';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                match: (card) => card.hasTrait('meishodo'),
                targetCondition: (target, source) => target === source
            })
        });

        this.action({
            title: 'Ready this character',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parent === context.source
            }),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}
