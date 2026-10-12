import { msg } from '../../GameChat.js';
import { dishonor, ready } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class KitsukiShomon extends DrawCard {
    static id = 'kitsuki-shomon';

    setupCardAbilities() {
        this.wouldInterrupt('Dishonor this character instead')
            .when({
                onCardDishonored: ({ card }, context) =>
                    card.controller === context.player &&
                    card.type === CardType.Character &&
                    dishonor().canAffect(context.source, context) &&
                    card !== context.source
            })
            .cancel((context) => ({
                target: context.source,
                replacementGameAction: dishonor(),
                thenGameAction: ready()
            }))
            .chatText((context) => msg`dishonor ${context.chatTarget()} instead of ${context.event.card}`);
    }
}
