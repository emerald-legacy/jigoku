import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, CardType } from '../../Constants.js';

class YasukiProcurer extends DrawCard {
    static id = 'yasuki-procurer';

    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of the next attachment or character',
            cost: AbilityDsl.costs.dishonorSelf(),
            effect: 'reduce the cost of their next attachment or character played this phase by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect((context: AbilityContext) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.reduceCost({
                    match: (card: any) => card.type === CardType.Attachment || card.type === CardType.Character,
                    limit: AbilityDsl.limit.fixed(1)
                })
            }))
        });
    }
}


export default YasukiProcurer;
