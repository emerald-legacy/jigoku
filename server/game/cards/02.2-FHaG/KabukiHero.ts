import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class KabukiHero extends DrawCard {
    static id = 'kabuki-hero';

    setupCardAbilities() {
        this.action('Gain military bonus')
            .cost(AbilityDsl.costs.payFate(1))
            .condition(() => this.game.isDuringConflict())
            .gameAction(cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(context.source.politicalSkill)
            })))
            .effect('give itself +{1}{2}/+0{3} until the end of the conflict', context => [context.source.politicalSkill, 'military', 'political']);
    }
}


export default KabukiHero;
