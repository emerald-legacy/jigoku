import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import { reveal } from '../../GameActions/GameActions.js';

class DaidojiMarketplace extends DrawCard {
    static id = 'daidoji-marketplace';

    setupCardAbilities() {
        this.reaction('Reveal this holding\'s province')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .gameAction(reveal(context => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            })))
            .effect('reveal {1}', context => context.player.getProvinceCardInProvince(context.source.location));
    }
}


export default DaidojiMarketplace;
