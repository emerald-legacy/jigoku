import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class SupernaturalStorm extends DrawCard {
    static id = 'supernatural-storm';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Increase the skill of one character',
            condition: () => this.controller.cardsInPlay.some((card: any) => card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect((context: any) => ({
                    effect: ability.effects.modifyBothSkills(context.player.cardsInPlay.reduce((total: number, card: any) => total + (card.hasTrait('shugenja') ? 1 : 0), 0))
                }))
            },
            effect: 'imbue {0} with the supernatural power of the storm!'
        });
    }
}


export default SupernaturalStorm;
