import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MirumotosFury extends DrawCard {
    static id = 'mirumoto-s-fury';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Bow attacking character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.getGlory() <= this.game.provinceCards.filter(card => (
                    card.isFacedown() && card.controller === context.player
                )).length
            }, ability.actions.bow());
    }
}


export default MirumotosFury;
