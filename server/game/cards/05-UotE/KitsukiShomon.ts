import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../basecard.js';
import { CardTypes } from '../../Constants.js';
import DrawCard from '../../drawcard.js';
import ThenAbility from '../../ThenAbility.js';

export default class KitsukiShomon extends DrawCard {
    static id = 'kitsuki-shomon';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Dishonor this character instead',
            when: {
                onCardDishonored: ({ card }: { card: BaseCard }, context) =>
                    card.controller === context.player &&
                    card.type === CardTypes.Character &&
                    context.source.allowGameAction('dishonor', context) &&
                    card !== context.source
            },
            effect: 'dishonor {0} instead of {1}',
            effectArgs: (context) => context.event.card,
            handler: (context) => {
                let newEvent = AbilityDsl.actions.dishonor().getEvent(context.source, context);
                context.event.replacementEvent = newEvent;
                let thenAbility = new ThenAbility(this.game, context.source, {
                    gameAction: AbilityDsl.actions.ready()
                });
                context.events = [newEvent];
                context.event.window.addEvent(newEvent);
                context.event.window.addThenAbility(thenAbility, context);
                context.cancel();
            }
        });
    }
}
