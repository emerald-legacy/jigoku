import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class TacticiansCamp extends DrawCard {
    static id = 'tactician-s-camp';

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isHonored,
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}


export default TacticiansCamp;

