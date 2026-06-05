import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, EventName } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Kikyo extends DrawCard {
    static id = 'kikyo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Make opponent discard a card at random',
                when: {
                    onCardsDrawn: (event: EventPayload<EventName.OnCardsDrawn>, context: TriggeredAbilityContext<this>) => {
                        return context.player.opponent && event.player === context.player && context.source.isParticipating();
                    }
                },
                printedAbility: false,
                gameAction: AbilityDsl.actions.discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            })
        });
    }
}


export default Kikyo;
