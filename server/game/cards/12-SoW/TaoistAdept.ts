import { msg } from '../../GameChat.js';
import { DuelType } from '../../Constants.js';
import { placeFateOnRing, selectRing } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

export default class TaoistAdept extends DrawCard {
    static id = 'taoist-adept';

    setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: () => msg`choose whether to place a fate on a ring`,
                gameAction: (duel) =>
                    selectRing({
                        activePromptTitle: 'Choose a ring to receive a fate',
                        player: duel.winnerController,
                        message: (_context, ring, player) => msg`${player} places a fate on the ${ring}`,
                        ringCondition: (ring) => ring.isUnclaimed(),
                        gameAction: placeFateOnRing(),
                        optional: true,
                        onMenuCommand: (player: Player, arg: string) => {
                            if(arg === 'done') {
                                this.game.addMessage(player.name + ' chooses not to place a fate on a ring');
                            }
                            return true;
                        }
                    })
            }));
    }
}
