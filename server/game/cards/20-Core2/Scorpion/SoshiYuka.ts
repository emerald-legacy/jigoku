import { CardType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class SoshiYuka extends DrawCard {
    static id = 'soshi-yuka';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            target: {
                mode: TargetMode.Exactly,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                cardCondition: (card: DrawCard) => !card.bowed
            },
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardType.Character,
                cardCondition: (card, context) => (context.targets.target as DrawCard[]).includes(card),
                gameAction: AbilityDsl.actions.bow(),
                message: '{0} is bowed, as they are dragged into a web of intrigue',
                messageArgs: (card, _player) => [card]
            }),
            effect: 'sow discord between {0}'
        });
    }
}
