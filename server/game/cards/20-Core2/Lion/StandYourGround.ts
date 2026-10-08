import { CharacterStatus } from '../../../Constants.js';
import { discardStatusToken } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class StandYourGround extends DrawCard {
    static id = 'stand-your-ground';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            })
            .cancel((context) => ({
                replacementGameAction: discardStatusToken({
                    target: context.event.card.getStatusToken(CharacterStatus.Honored)
                })
            }))
            .chatText('prevent {1} from leaving play', (context) => context.event.card)
            .cannotBeMirrored();
    }
}
