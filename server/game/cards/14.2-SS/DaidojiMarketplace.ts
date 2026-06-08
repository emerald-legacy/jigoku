import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiMarketplace extends DrawCard {
    static id = 'daidoji-marketplace';

    setupCardAbilities() {
        this.reaction({
            title: 'Reveal this holding\'s province',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            gameAction: AbilityDsl.actions.reveal(context => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            })),
            effect: 'reveal {1}',
            effectArgs: context => context.player.getProvinceCardInProvince(context.source.location)
        });
    }
}


export default DaidojiMarketplace;
