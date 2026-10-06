import { chooseAction, setHonorDial } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class IdeNegotiator extends DrawCard {
    static id = 'ide-negotiator';

    setupCardAbilities() {
        this.reaction('Modify honor dial')
            .when({ onHonorDialsRevealed: () => true })
            .gameAction(chooseAction((context) => ({
                options: {
                    'Increase bid by 1': {
                        action: setHonorDial({
                            target: context.player,
                            value: context.player.honorBid + 1
                        }),
                        message: '{0} chooses to increase their honor bid by 1'
                    },
                    'Decrease bid by 1': {
                        action: setHonorDial({
                            target: context.player,
                            value: context.player.honorBid - 1
                        }),
                        message: '{0} chooses to decrease their honor bid by 1'
                    }
                }
            })))
            .effect('modify their honor dial');
    }
}
