import DrawCard from '../../DrawCard.js';
import { CardType, Phase, Players } from '../../Constants.js';
import { multiple, sacrifice, selectCard } from '../../GameActions/GameActions.js';

class WardenOfTheDamned extends DrawCard {
    static id = 'warden-of-the-damned';

    setupCardAbilities() {
        this.forcedInterrupt('Each player sacrifices a dishonored character')
            .when({
                onPhaseEnded: event => event.phase === Phase.Conflict
            })
            .gameAction(multiple([
                selectCard(context => ({
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: CardType.Character,
                    controller: context.player.firstPlayer ? Players.Self : Players.Opponent,
                    player: context.player.firstPlayer ? Players.Self : Players.Opponent,
                    cardCondition: card => card.isDishonored,
                    gameAction: sacrifice()
                })),
                selectCard(context => ({
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: CardType.Character,
                    controller: context.player.firstPlayer ? Players.Opponent : Players.Self,
                    player: context.player.firstPlayer ? Players.Opponent : Players.Self,
                    cardCondition: card => card.isDishonored,
                    gameAction: sacrifice()
                }))
            ]))
            .chatText('force both players to sacrifice a dishonored character');
    }
}


export default WardenOfTheDamned;
