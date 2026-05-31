import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MirumotosFury extends DrawCard {
    static id = 'mirumoto-s-fury';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow attacking character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isAttacking() && card.getGlory() <= this.game.provinceCards.filter(card => (
                    card.isFacedown() && card.controller === context.player
                )).length,
                gameAction: ability.actions.bow()
            }
        });
    }
}


export default MirumotosFury;
