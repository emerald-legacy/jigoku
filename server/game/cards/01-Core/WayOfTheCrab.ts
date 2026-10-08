import { CardType, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perRound } from '../../AbilityLimit.js';
import { sacrifice } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class WayOfTheCrab extends DrawCard {
    static id = 'way-of-the-crab';

    public setupCardAbilities() {
        this.action('Make your opponent sacrifice a character')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('crab')
            }))
            .condition((context) => context.player.opponent !== undefined)
            .selectCard((context) => ({
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardType.Character,
                controller: Players.Opponent,
                message: '{0} sacrifices {1} to {2}',
                messageArgs: (card) => [context.player.opponent, card, context.source],
                gameAction: sacrifice()
            }))
            .chatText('force {1} to sacrifice a character', (context) => context.player.opponent ?? '')
            .max(perRound(1));
    }
}
