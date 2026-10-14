import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';

class DaidojiMarketplace extends DrawCard {
    static id = 'daidoji-marketplace';

    setupCardAbilities() {
        this.reaction('Reveal this holding\'s province')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .reveal((context) => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            }))
            .chatText((context) => msg`reveal ${context.player.getProvinceCardInProvince(context.source.location)}`);
    }
}


export default DaidojiMarketplace;
