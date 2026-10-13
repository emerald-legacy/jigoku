import * as costs from '../../costs/index.js';
import { modifyPoliticalSkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class SakeHouseConfidant extends DrawCard {
    static id = 'sake-house-confidant';

    setupCardAbilities() {
        this.action('Give Shinobi +2 political')
            .condition((context) => context.source.isParticipating())
            .cost(costs.discardImperialFavor())
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.hasTrait('shinobi')),
                effect: modifyPoliticalSkill(2)
            }))
            .chatText('give their Shinobi +0/+2');
    }
}


export default SakeHouseConfidant;
