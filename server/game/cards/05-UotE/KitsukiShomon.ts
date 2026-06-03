import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type EventWindow from '../../Events/EventWindow.js';
import ThenAbility from '../../ThenAbility.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class KitsukiShomon extends DrawCard {
    static id = 'kitsuki-shomon';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Dishonor this character instead',
            when: {
                onCardDishonored: ({ card }: { card: BaseCard }, context: TriggeredAbilityContext) =>
                    card.controller === context.player &&
                    card.type === CardType.Character &&
                    context.source.allowGameAction('dishonor', context) &&
                    card !== context.source
            },
            effect: 'dishonor {0} instead of {1}',
            effectArgs: (context: TriggeredAbilityContext) => context.event.card ?? '',
            handler: (context: TriggeredAbilityContext) => {
                let newEvent = AbilityDsl.actions.dishonor().getEvent(context.source, context);
                context.event.replacementEvent = newEvent;
                let thenAbility = new ThenAbility(context.source, {
                    gameAction: AbilityDsl.actions.ready()
                });
                context.events = [newEvent];
                const window = context.event.window as EventWindow;
                window.addEvent(newEvent);
                window.addThenAbility(thenAbility, context);
                context.cancel();
            }
        });
    }
}
