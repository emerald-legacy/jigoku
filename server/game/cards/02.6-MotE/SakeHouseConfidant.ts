import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

class SakeHouseConfidant extends DrawCard {
    static id = 'sake-house-confidant';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Give Shinobi +2 political',
            condition: context => context.source.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            effect: 'give their Shinobi +0/+2',
            gameAction: ability.actions.cardLastingEffect((context: AbilityContext) => ({
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.hasTrait('shinobi')),
                effect: ability.effects.modifyPoliticalSkill(2)
            }))
        });
    }
}


export default SakeHouseConfidant;
