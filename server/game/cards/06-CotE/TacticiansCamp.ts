import { modifyMilitarySkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class TacticiansCamp extends DrawCard {
    static id = 'tactician-s-camp';

    override setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.type === CardType.Character && card.isHonored,
            effect: modifyMilitarySkill(1)
        });
    }
}


export default TacticiansCamp;

