import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class AdornedTemple extends DrawCard {
    static id = 'adorned-temple';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw cards',
            when: {
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context: any) => {
                    return (
                        event.fate > 0 &&
                        event.recipient &&
                        (event.recipient as any).controller === context.player &&
                        event.context?.ability.isCardAbility()
                    );
                }
            },
            effect: 'draw {1} card{2}',
            effectArgs: (context: AbilityContext) => (((context as TriggeredAbilityContext).event.recipient as DrawCard)?.isOrdinary() ? ['2', 's'] : ['a', '']),
            gameAction: AbilityDsl.actions.draw((context: AbilityContext) => ({
                target: context.player,
                amount: ((context as TriggeredAbilityContext).event.recipient as DrawCard)?.isOrdinary() ? 2 : 1
            }))
        });
    }
}


export default AdornedTemple;
