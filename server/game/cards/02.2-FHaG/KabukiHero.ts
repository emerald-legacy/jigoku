import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';

class KabukiHero extends DrawCard {
    static id = 'kabuki-hero';

    setupCardAbilities() {
        this.action('Gain military bonus')
            .cost(costs.payFate(1))
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(context.source.politicalSkill)
            }))
            .chatText('give itself +{1}{2}/+0{3} until the end of the conflict', context => [context.source.politicalSkill, 'military', 'political']);
    }
}


export default KabukiHero;
