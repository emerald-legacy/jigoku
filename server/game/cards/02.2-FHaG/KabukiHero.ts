import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`give itself +${context.source.politicalSkill}${'military'}/+0${'political'} until the end of the conflict`);
    }
}


export default KabukiHero;
