import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';

class FawningDiplomat extends DrawCard {
    static id = 'fawning-diplomat';

    override setupCardAbilities() {
        this.interrupt('Claim Imperial favor')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .claimImperialFavor()
            .chatText((context) => msg`claim the ${context.game.rules.imperialFavorSovereign} favor as she leaves play`);
    }
}


export default FawningDiplomat;
