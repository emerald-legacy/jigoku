import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perGame } from '../../../AbilityLimit.js';
import { sacrifice, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class OurDuty extends DrawCard {
    static id = 'our-duty-';

    public override setupCardAbilities() {
        this.action('Make your opponent sacrifice a character')
            .condition((context) => context.game.roundNumber > 1 && Boolean(context.player.opponent))
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('crab')
            }))
            .selectCard({
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardType.Character,
                controller: Players.Opponent,
                message: (context, card) => msg`${context.player.opponent} sacrifices ${card} to ${context.source}`,
                gameAction: sacrifice()
            })
            .chatText((context) => msg`force ${context.player.opponent} to sacrifice a character`)
            .max(perGame(1));

        this.conflictAction('Move an attacker home', { conflictType: ConflictType.Military })
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, sendHome());
    }
}
