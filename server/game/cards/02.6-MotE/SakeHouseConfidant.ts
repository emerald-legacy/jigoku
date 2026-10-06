import AbilityDsl from '../../abilitydsl.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class SakeHouseConfidant extends DrawCard {
    static id = 'sake-house-confidant';

    setupCardAbilities() {
        this.action('Give Shinobi +2 political')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .condition(context => context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.hasTrait('shinobi')),
                effect: modifyPoliticalSkill(2)
            })))
            .effect('give their Shinobi +0/+2');
    }
}


export default SakeHouseConfidant;
