import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import { reveal } from '../../GameActions/GameActions.js';

class DaidojiMarketplace extends DrawCard {
    static id = 'daidoji-marketplace';

    setupCardAbilities() {
        this.reaction('Reveal this holding\'s province')
            .when({
                onPhaseStarted: event => event.phase === Phase.Conflict
            })
            .gameAction(reveal(context => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            })))
            .chatText('reveal {1}', context => context.player.getProvinceCardInProvince(context.source.location));
    }
}


export default DaidojiMarketplace;
