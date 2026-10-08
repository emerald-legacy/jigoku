import DrawCard from '../../../DrawCard.js';
import { createToken } from '../../../GameActions/GameActions.js';
import UnleashedHound from '../../UnleashedHound.js';

export default class ShinjoSora extends DrawCard {
    static id = 'shinjo-sora';

    setupCardAbilities() {
        this.conflictAction('Create beasts from facedown dynasty cards')
            .gameAction(createToken((context) => ({
                target: context.game
                    .getProvinceArray()
                    .flatMap((location) =>
                        context.player.getDynastyCardsInProvince(location).filter((card) => card.isFacedown())
                    ),
                token: UnleashedHound,
                canEnterConflict: () => true,
                leavingPlayMessage: '{0} grows tired and decides to have a nap'
            })))
            .chatText('release the hounds');
    }
}
