import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import { placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaBodyguard extends DrawCard {
    static id = 'shiba-bodyguard';

    public setupCardAbilities() {
        this.interrupt('Place a fate on a character')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.hasTrait('bushi')
            }, placeFate((context) => ({
                origin: context.player
            })))
            .chatText((context) => msg`place a fate from ${context.player}'s fate pool on ${context.chatTarget()}`);
    }
}
