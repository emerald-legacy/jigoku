import AbilityDsl from '../../../abilitydsl.js';
import { Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class PromisingHohei extends DrawCard {
    static id = 'promising-hohei';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target) => target.isCharacter() && target.getGlory() >= 2,
                match: (card, source) => card === source
            })
        });

        this.reaction('return a follower to hand')
            .when({
                onCardAttached: (event, context) => event.card === context.source
            })
            .target({
                controller: Players.Self,
                cardCondition: (card) => card.name !== 'Promising Hohei' && card.hasTrait('follower')
            }, AbilityDsl.actions.returnToHand());
    }
}
