import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { selectRing, switchConflictElement, switchConflictType } from '../../GameActions/GameActions.js';

export default class KuroiMori extends ProvinceCard {
    static id = 'kuroi-mori';

    setupCardAbilities() {
        this.action('Switch the conflict type or ring')
            .select({}, {
                'Switch the contested ring': selectRing({
                    activePromptTitle: 'Choose a ring to switch with the contested ring',
                    message: (_context, ring, player) => msg`${player} switches the contested ring with ${ring}`,
                    ringCondition: (ring) => ring.isUnclaimed(),
                    gameAction: switchConflictElement()
                }),
                'Switch the conflict type': switchConflictType()
            })
            .chatText((context) => msg`${context.select.toLowerCase()}`);
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
