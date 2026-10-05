import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';

class SeppunIshikawa extends DrawCard {
    static id = 'seppun-ishikawa';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills((card) => this.getImperialCardsInPlay(card))
        });
    }

    getImperialCardsInPlay(source: DrawCard) {
        return this.game.allCards.reduce((sum, card) => {
            if(card !== source && card.controller === source.controller && card.hasTrait('imperial') && card.isFaceup() &&
                (card.location === Location.PlayArea || (card.isProvinceCard() && !card.isBroken) ||
                (card.isInProvince() && card.type === CardType.Holding))) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}


export default SeppunIshikawa;
