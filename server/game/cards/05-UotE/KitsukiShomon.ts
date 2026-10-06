import { dishonor, ready } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import ThenAbility from '../../ThenAbility.js';

export default class KitsukiShomon extends DrawCard {
    static id = 'kitsuki-shomon';

    setupCardAbilities() {
        this.wouldInterrupt('Dishonor this character instead')
            .when({
                onCardDishonored: ({ card }, context) =>
                    card.controller === context.player &&
                    card.type === CardType.Character &&
                    context.source.allowGameAction('dishonor', context) &&
                    card !== context.source
            })
            .handler((context) => {
                const window = context.event.window;
                if(!window) {
                    return;
                }
                const newEvent = dishonor().getEvent(context.source, context);
                context.event.replacementEvent = newEvent;
                const thenAbility = new ThenAbility(context.source, {
                    gameAction: ready()
                });
                context.events = [newEvent];
                window.addEvent(newEvent);
                window.addThenAbility(thenAbility, context);
                context.cancel();
            })
            .effect('dishonor {0} instead of {1}', (context) => context.event.card);
    }
}
