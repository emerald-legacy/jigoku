import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KuroiMori extends ProvinceCard {
    static id = 'kuroi-mori';

    setupCardAbilities() {
        this.action('Switch the conflict type or ring')
            .select('target', {

            }, {
                'Switch the contested ring': AbilityDsl.actions.selectRing({
                    activePromptTitle: 'Choose a ring to switch with the contested ring',
                    message: '{0} switches the contested ring with {1}',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    messageArgs: (ring, player) => [player, ring],
                    gameAction: AbilityDsl.actions.switchConflictElement()
                }),
                'Switch the conflict type': AbilityDsl.actions.switchConflictType()
            })
            .effect('{1}', (context) => context.select.toLowerCase());
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
