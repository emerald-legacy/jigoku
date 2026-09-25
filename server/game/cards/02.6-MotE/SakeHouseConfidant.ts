import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class SakeHouseConfidant extends DrawCard {
    static id = 'sake-house-confidant';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Give Shinobi +2 political')
            .cost(ability.costs.discardImperialFavor())
            .condition(context => context.source.isParticipating())
            .gameAction(ability.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.hasTrait('shinobi')),
                effect: ability.effects.modifyPoliticalSkill(2)
            })))
            .effect('give their Shinobi +0/+2');
    }
}


export default SakeHouseConfidant;
