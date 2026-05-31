import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class IuchiTadamatsu extends DrawCard {
    static id = 'iuchi-tadamatsu';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                match: (card: any) => card.hasTrait('meishodo'),
                targetCondition: (target: any, source: any) => target === source
            })
        });

        this.action({
            title: 'Ready this character',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent === context.source
            }),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}
