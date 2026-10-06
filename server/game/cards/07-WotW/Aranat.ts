import DrawCard from '../../DrawCard.js';
import { placeFate, reveal, selectCards } from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class Aranat extends DrawCard {
    static id = 'aranat';

    setupCardAbilities() {
        this.reaction('Place additional fate')
            .when({
                onCardPlayed: (event, context) => context.player.opponent && event.card === context.source
            })
            .gameAction(selectCards({
                cardType: CardType.Province,
                location: this.game.getProvinceArray(false),
                controller: Players.Opponent,
                player: Players.Opponent,
                optional: true,
                mode: TargetMode.Unlimited,
                cardCondition: (card) => card.isFacedown(),
                message: '{0} chooses to reveal {1}',
                messageArgs: (card, player) => [player, card],
                gameAction: reveal()
            }))
            .effect('give {1} the opportunity to reveal provinces', (context) => context.player.opponent ?? '')
            .thenAlways()
            .gameAction(placeFate((context) => ({ amount: context.player.getNumberOfOpponentsFacedownProvinces() })))
            .message((context) => {
                const facedown = context.player.getNumberOfOpponentsFacedownProvinces();
                return msg`${context.player.opponent} has ${facedown} facedown provinces so ${facedown} fate is placed on ${context.source}`;
            });
    }
}


export default Aranat;
