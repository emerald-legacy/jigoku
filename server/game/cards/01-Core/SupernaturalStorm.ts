import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class SupernaturalStorm extends DrawCard {
    static id = 'supernatural-storm';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Increase the skill of one character',
            condition: () => this.controller.cardsInPlay.some(card => card.hasTrait('shugenja')),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect((context: AbilityContext) => ({
                    effect: ability.effects.modifyBothSkills(context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0))
                }))
            },
            effect: 'imbue {0} with the supernatural power of the storm!'
        });
    }
}


export default SupernaturalStorm;
