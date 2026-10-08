import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { loseFate, placeFate } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class DiplomaticGiftGiver extends DrawCard {
    static id = 'diplomatic-gift-giver';

    setupCardAbilities() {
        this.action('Put fate on characters')
            .condition((context) => !!(context.source.isParticipating() && context.player.opponent && loseFate().canAffect(context.player.opponent, context) && loseFate().canAffect(context.player, context)))
            .target({
                name: 'firstCharacter',
                activePromptTitle: 'Choose a character to receive the gift of fate',
                cardType: CardType.Character,
                controller: (context) => context.player.firstPlayer ? Players.Opponent : Players.Self,
                player: (context) => context.player.firstPlayer ? Players.Self : Players.Opponent
            }, placeFate((context) => ({
                origin: context.player.firstPlayer ? context.player : context.player.opponent
            })))
            .target({
                name: 'secondCharacter',
                activePromptTitle: 'Choose a character to receive the gift of fate',
                cardType: CardType.Character,
                controller: (context) => context.player.firstPlayer ? Players.Self : Players.Opponent,
                player: (context) => context.player.firstPlayer ? Players.Opponent : Players.Self
            }, placeFate((context) => ({
                origin: context.player.firstPlayer ? context.player.opponent : context.player
            })))
            .chatText((context) => msg`gift a fate onto ${context.targets.firstCharacter} and ${context.targets.secondCharacter}`);
    }
}


export default DiplomaticGiftGiver;
