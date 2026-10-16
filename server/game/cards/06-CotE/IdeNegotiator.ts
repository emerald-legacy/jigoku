import { msg } from '../../GameChat.js';
import { setHonorDial } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class IdeNegotiator extends DrawCard {
    static id = 'ide-negotiator';

    override setupCardAbilities() {
        this.reaction('Modify honor dial')
            .when({ onHonorDialsRevealed: () => true })
            .chooseAction((context) => ({
                choices: {
                    'Increase bid by 1': {
                        action: setHonorDial({
                            target: context.player,
                            value: context.player.showBid + 1
                        }),
                        message: (_context, _target, player) => msg`${player} chooses to increase their honor bid by 1`
                    },
                    'Decrease bid by 1': {
                        action: setHonorDial({
                            target: context.player,
                            value: context.player.showBid - 1
                        }),
                        message: (_context, _target, player) => msg`${player} chooses to decrease their honor bid by 1`
                    }
                }
            }))
            .chatText('modify their honor dial');
    }
}
