import { msg } from '../../../GameChat.js';
import { addKeyword } from '../../../effects.js';
import { cardLastingEffect, honor, multipleContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CaretakerOfTheDeadEyes extends DrawCard {
    static id = 'caretaker-of-the-dead-eyes';

    setupCardAbilities() {
        this.interrupt('Honor a character')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.hasTrait('bushi')
            })
            .gameAction(multipleContext((context) => {
                const card = context.event.card;
                const gameActions = [];
                if(card.isDishonored) {
                    gameActions.push(honor({ target: card }));
                }
                if(card.hasTrait('berserker')) {
                    gameActions.push(cardLastingEffect({
                        target: card,
                        effect: addKeyword('courtesy'),
                        chatText: () => msg`give Courtesy to ${card}`
                    }));
                }

                return { gameActions };
            }));
    }
}
