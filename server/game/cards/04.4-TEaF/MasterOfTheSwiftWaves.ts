import { joint, moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class MasterOfTheSwiftWaves extends DrawCard {
    static id = 'master-of-the-swift-waves';

    setupCardAbilities() {
        this.action('Switch 2 characters you control')
            .target({
                name: 'characterInConflict',
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            })
            .target({
                name: 'characterAtHome',
                dependsOn: 'characterInConflict',
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                controller: Players.Self
            }, joint([
                sendHome(context => ({ target: context.targets.characterInConflict })),
                moveToConflict()
            ]))
            .chatText((context) => msg`switch ${context.targets.characterInConflict} and ${context.targets.characterAtHome}`);
    }
}


export default MasterOfTheSwiftWaves;
