import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class SakeHouseConfidant extends DrawCard {
    static id = 'sake-house-confidant';

    setupCardAbilities() {
        this.action('Give Shinobi +2 political')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .condition(context => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.hasTrait('shinobi')),
                effect: AbilityDsl.effects.modifyPoliticalSkill(2)
            })))
            .effect('give their Shinobi +0/+2');
    }
}


export default SakeHouseConfidant;
