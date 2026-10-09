import { msg } from '../../GameChat.js';
import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { placeFate, selectCard } from '../../GameActions/GameActions.js';

export default class FeastOrFamine extends ProvinceCard {
    static id = 'feast-or-famine';

    setupCardAbilities() {
        this.interrupt('Move 1 fate from an opposing character')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent
            }, selectCard((context) => ({
                cardType: CardType.Character,
                controller: Players.Self,
                message: (context, card) => msg`${context.player} moves 1 fate from ${context.target} to ${card}`,
                gameAction: placeFate({
                    origin: context.target
                })
            })))
            .chatText('move 1 fate from {0} to a character they control');
    }
}
