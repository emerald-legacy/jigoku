import { msg } from '../../../GameChat.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class SoshiYuka extends DrawCard {
    static id = 'soshi-yuka';

    setupCardAbilities() {
        this.action('Bow a character')
            .targetCards({
                mode: TargetMode.Exactly,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                cardCondition: (card) => !card.bowed
            })
            .selectCard((context) => ({
                cardType: CardType.Character,
                cardCondition: (card) => card.isCharacter() && context.targets.target.includes(card),
                gameAction: bow(),
                message: (_context, card, _player) => msg`${card} is bowed, as they are dragged into a web of intrigue`
            }))
            .chatText('sow discord between {0}');
    }
}
