import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class ShinjoTrailblazer extends DrawCard {
    static id = 'shinjo-trailblazer';

    setupCardAbilities() {
        this.reaction('Gain +2/+2')
            .when({
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            })
            .cardLastingEffect({ effect: modifyBothSkills(2) })
            .chatText('give {0} +2{1}, +2{2}', () => ['military', 'political']);
    }
}


export default ShinjoTrailblazer;
