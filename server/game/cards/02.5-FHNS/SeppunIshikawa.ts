import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';

class SeppunIshikawa extends DrawCard {
    static id = 'seppun-ishikawa';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills((card: DrawCard) => this.getImperialCardsInPlay(card))
        });
    }

    getImperialCardsInPlay(source: DrawCard) {
        return this.game.allCards.reduce((sum: number, card: any) => {
            if(card !== source && card.controller === source.controller && card.hasTrait('imperial') && card.isFaceup() &&
                (card.location === Locations.PlayArea || (card.isProvince && !card.isBroken) ||
                (card.isInProvince() && card.type === CardTypes.Holding))) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}


export default SeppunIshikawa;
