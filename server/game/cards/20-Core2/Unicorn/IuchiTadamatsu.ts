import AbilityDsl from '../../../abilitydsl.js';
import { reduceCost } from '../../../effects.js';
import { ready } from '../../../GameActions/GameActions.js';
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
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parentCharacter === context.source
            }))
            .gameAction(ready());
    }
}
