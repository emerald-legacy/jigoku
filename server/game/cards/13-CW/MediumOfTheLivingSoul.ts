import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { gainAbility } from '../../effects.js';
import { cardLastingEffect, resolveRingEffect } from '../../GameActions/GameActions.js';
import { AbilityType, CardType, Players } from '../../Constants.js';

class MediumOfTheLivingSoul extends DrawCard {
    static id = 'medium-of-the-living-soul';

    setupCardAbilities() {
        this.action('Grant an ability to resolve ring effects')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect(() => ({
                effect: gainAbility<DrawCard>(AbilityType.Reaction, {
                    title: 'Resolve the Ring Effect',
                    when: {
                        onResolveRingElement: (event, context) => event.player === context.player && context.source.isParticipating()
                    },
                    cost: costs.removeFateFromSelf(),
                    gameAction: resolveRingEffect((context) => ({ target: context.event.ring }))
                })
            })))
            .effect('give {0} the ability to resolve a ring effect');
    }
}


export default MediumOfTheLivingSoul;
