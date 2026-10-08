import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perGame } from '../../../AbilityLimit.js';
import { sacrifice, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class OurDuty extends DrawCard {
    static id = 'our-duty-';

    public setupCardAbilities() {
        this.action('Make your opponent sacrifice a character')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('crab')
            }))
            .condition((context) => context.game.roundNumber > 1 && Boolean(context.player.opponent))
            .selectCard({
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardType.Character,
                controller: Players.Opponent,
                message: (context, card) => msg`${context.player.opponent} sacrifices ${card} to ${context.source}`,
                gameAction: sacrifice()
            })
            .chatText('force {1} to sacrifice a character', (context) => context.player.opponent)
            .max(perGame(1));

        this.action('Move an attacker home')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }))
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, sendHome());
    }
}
