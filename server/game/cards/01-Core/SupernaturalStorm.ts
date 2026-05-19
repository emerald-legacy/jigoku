import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class SupernaturalStorm extends DrawCard {
    static id = 'supernatural-storm';

    setupCardAbilities(ability) {
        this.action({
            title: 'Increase the skill of one character',
            condition: () => this.controller.cardsInPlay.some(card => card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBothSkills(context.player.cardsInPlay.reduce((total, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0))
                }))
            },
            effect: 'imbue {0} with the supernatural power of the storm!'
        });
    }
}


export default SupernaturalStorm;
