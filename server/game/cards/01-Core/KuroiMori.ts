import { ProvinceCard } from '../../ProvinceCard.js';
import { selectRing, switchConflictElement, switchConflictType } from '../../GameActions/GameActions.js';

export default class KuroiMori extends ProvinceCard {
    static id = 'kuroi-mori';

    setupCardAbilities() {
        this.action('Switch the conflict type or ring')
            .select({}, {
                'Switch the contested ring': selectRing({
                    activePromptTitle: 'Choose a ring to switch with the contested ring',
                    message: '{0} switches the contested ring with {1}',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    messageArgs: (ring, player) => [player, ring],
                    gameAction: switchConflictElement()
                }),
                'Switch the conflict type': switchConflictType()
            })
            .chatText('{1}', (context) => context.select.toLowerCase());
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
