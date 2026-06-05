import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Players } from '../../Constants.js';
import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Deathseeker extends DrawCard {
    static id = 'deathseeker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        // TODO: RemoveFateOrDiscard action?
        this.reaction<DrawCard>({
            title: 'Remove fate/discard character',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext) => event.conflict.loser === context.player && (context.source as DrawCard).isAttacking()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: any, innerContext: AbilityContext) => (card.getFate() > 0 ? card.allowGameAction('removeFate', innerContext) : card.allowGameAction('discardFromPlay', innerContext))
            },
            effect: '{1} {0}',
            effectArgs: (context) => (context.target?.getFate() ?? 0) > 0 ? 'remove 1 fate from' : 'discard',
            handler: (context) => {
                if(!context.target) {
                    return;
                }
                if(context.target.getFate() === 0) {
                    this.game.applyGameAction(context, { discardFromPlay: context.target });
                } else {
                    this.game.applyGameAction(context, { removeFate: context.target });
                }
            }
        });
    }
}


export default Deathseeker;
