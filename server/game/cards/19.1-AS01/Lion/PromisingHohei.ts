import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations, Players, TargetModes } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class PromisingHohei extends DrawCard {
    static id = 'promising-hohei';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: any) => target.type === CardTypes.Character && target.getGlory() >= 2,
                match: (card: any, source: any) => card === source
            })
        });

        this.reaction({
            title: 'return a follower to hand',
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.Single,
                controller: Players.Self,
                cardCondition: (card) => card.name !== 'Promising Hohei' && card.hasTrait('follower'),
                gameAction: AbilityDsl.actions.returnToHand()
            }
        });
    }
}
