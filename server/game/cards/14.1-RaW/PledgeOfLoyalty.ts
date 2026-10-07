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
            .effect('prevent {1} from leaving play', (context) => context.event?.card ?? '');
    }
}
