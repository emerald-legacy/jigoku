import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class TacticiansCamp extends DrawCard {
    static id = 'tactician-s-camp';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            match: (card: DrawCard) => card.getType() === CardType.Character && card.isHonored,
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}


export default TacticiansCamp;

