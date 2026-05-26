import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class AdornedTemple extends DrawCard {
    static id = 'adorned-temple';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw cards',
            when: {
                onMoveFate: (event: EventPayload<EventNames.OnMoveFate>, context: any) => {
                    return (
                        event.fate > 0 &&
                        event.recipient &&
                        (event.recipient as any).controller === context.player &&
                        event.context?.ability.isCardAbility()
                    );
                }
            },
            effect: 'draw {1} card{2}',
            effectArgs: (context: any) => (context.event.recipient.isOrdinary() ? ['2', 's'] : ['a', '']),
            gameAction: AbilityDsl.actions.draw((context: any) => ({
                target: context.player,
                amount: context.event.recipient.isOrdinary() ? 2 : 1
            }))
        });
    }
}


export default AdornedTemple;
