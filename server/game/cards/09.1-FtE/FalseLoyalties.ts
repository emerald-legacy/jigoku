import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { joint, moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class FalseLoyalties extends DrawCard {
    static id = 'false-loyalties';

    setupCardAbilities() {
        this.reaction('Switch 2 characters your opponent controls')
            .when({
                afterConflict: (event, context) => {
                    return context.player.opponent && event.conflict.winner === context.player.opponent &&
                    context.player.opponent.isMoreHonorable();
                }
            })
            .target({
                name: 'characterInConflict',
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            })
            .target({
                name: 'characterAtHome',
                dependsOn: 'characterInConflict',
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                controller: Players.Opponent
            }, joint([
                sendHome(context => ({ target: context.targets.characterInConflict })),
                moveToConflict()
            ]))
            .chatText((context) => msg`switch ${context.targets.characterInConflict} and ${context.targets.characterAtHome}`);
    }
}


export default FalseLoyalties;
