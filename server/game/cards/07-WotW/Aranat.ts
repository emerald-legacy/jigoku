import DrawCard from '../../DrawCard.js';
import { reveal } from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class Aranat extends DrawCard {
    static id = 'aranat';

    override setupCardAbilities() {
        this.reaction('Place additional fate')
            .when({
                onCardPlayed: (event, context) => context.player.opponent && event.card === context.source
            })
            .selectCards({
                cardType: CardType.Province,
                location: this.game.getProvinceArray(false),
                controller: Players.Opponent,
                player: Players.Opponent,
                optional: true,
                mode: TargetMode.Unlimited,
                cardCondition: (card) => card.isFacedown(),
                message: (_context, card, player) => msg`${player} chooses to reveal ${card}`,
                gameAction: reveal()
            })
            .chatText((context) => msg`give ${context.player.opponent ?? ''} the opportunity to reveal provinces`)
            .afterwards()
            .placeFate((context) => ({ amount: context.player.getNumberOfOpponentsFacedownProvinces() }))
            .message((context) => {
                const facedown = context.player.getNumberOfOpponentsFacedownProvinces();
                return msg`${context.player.opponent} has ${facedown} facedown province${facedown === 1 ? '' : 's'} so ${facedown} fate is placed on ${context.source}`;
            });
    }
}


export default Aranat;
