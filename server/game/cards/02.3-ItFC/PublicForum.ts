import { ProvinceCard } from '../../ProvinceCard.js';
import { addToken } from '../../GameActions/GameActions.js';

export default class PublicForum extends ProvinceCard {
    static id = 'public-forum';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent break and add Honor token')
            .when({
                onBreakProvince: (event, context) => event.card === context.source && !event.card.hasToken('honor')
            })
            .cancel((context) => ({
                replacementGameAction: addToken({ target: context.source })
            }))
            .effect('add an honor token to {0} instead of breaking it');
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
