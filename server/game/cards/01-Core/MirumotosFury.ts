import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';

class MirumotosFury extends DrawCard {
    static id = 'mirumoto-s-fury';

    setupCardAbilities(ability) {
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
