import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, Players } from '../../Constants.js';

class MediumOfTheLivingSoul extends DrawCard {
    static id = 'medium-of-the-living-soul';

    setupCardAbilities() {
        this.action('Grant an ability to resolve ring effects')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect(() => ({
                effect: AbilityDsl.effects.gainAbility<DrawCard>(AbilityType.Reaction, {
                    title: 'Resolve the Ring Effect',
                    when: {
                        onResolveRingElement: (event, context) => {
                            let val = event.player === context.player && context.source.isParticipating();
                            return val;
                        }
                    },
                    cost: AbilityDsl.costs.removeFateFromSelf(),
                    gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({ target: context.event.ring }))
                })
            })))
            .effect('give {0} the ability to resolve a ring effect');
    }
}


export default MediumOfTheLivingSoul;
