import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { sacrifice } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class HidaAmoro extends DrawCard {
    static id = 'hida-amoro';

    setupCardAbilities() {
        this.forcedReaction('Sacrifice a character')
            .when({
                onConflictPass: () => true
            })
            .selectCard((context) => ({
                player: context.event.conflict.attackingPlayer === context.player ? Players.Self : Players.Opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardType.Character,
                cardCondition: (card) => card.controller === context.event.conflict.attackingPlayer,
                message: (context, card) => msg`${context.event.conflict.attackingPlayer} sacrifices ${card} to ${context.source}`,
                gameAction: sacrifice()
            }))
            .chatText('force {1} to sacrifice a character', (context) => context.event.conflict.attackingPlayer)
            .limit(unlimited());
    }
}


export default HidaAmoro;
