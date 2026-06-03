import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class PromisingHohei extends DrawCard {
    static id = 'promising-hohei';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: any) => target.type === CardType.Character && target.getGlory() >= 2,
                match: (card: any, source: any) => card === source
            })
        });

        this.reaction({
            title: 'return a follower to hand',
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetMode.Single,
                controller: Players.Self,
                cardCondition: (card) => card.name !== 'Promising Hohei' && card.hasTrait('follower'),
                gameAction: AbilityDsl.actions.returnToHand()
            }
        });
    }
}
