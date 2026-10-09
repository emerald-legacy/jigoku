import DrawCard from '../../DrawCard.js';
import { Phase, Players, CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class HigesSermon extends DrawCard {
    static id = 'hige-s-sermon';

    setupCardAbilities() {
        this.action('Bow characters')
            .condition((context) => context.player.cardsInPlay.some((a) => !a.bowed) && context.player.opponent !== undefined && context.player.opponent.cardsInPlay.some((a) => !a.bowed))
            .target({
                name: 'firstCharacter',
                activePromptTitle: 'Choose a character to bow',
                cardType: CardType.Character,
                controller: (context) => context.player.firstPlayer ? Players.Opponent : Players.Self,
                player: (context) => context.player.firstPlayer ? Players.Self : Players.Opponent
            }, bow())
            .target({
                name: 'secondCharacter',
                activePromptTitle: 'Choose a character to bow',
                cardType: CardType.Character,
                controller: (context) => context.player.firstPlayer ? Players.Self : Players.Opponent,
                player: (context) => context.player.firstPlayer ? Players.Opponent : Players.Self
            }, bow())
            .chatText((context) => msg`bow ${context.targets.firstCharacter} and ${context.targets.secondCharacter}`)
            .phase(Phase.Draw);
    }
}


export default HigesSermon;


