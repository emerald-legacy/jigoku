import { msg } from '../../GameChat.js';
import { CharacterStatus } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { discardStatusToken } from '../../GameActions/GameActions.js';

export default class PledgeOfLoyalty extends ProvinceCard {
    static id = 'pledge-of-loyalty';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            })
            .cancel((context) => ({
                replacementGameAction: discardStatusToken({
                    target: context.event?.card.getStatusToken(CharacterStatus.Honored)
                })
            }))
            .chatText((context) => msg`prevent ${context.event?.card ?? ''} from leaving play`);
    }
}
