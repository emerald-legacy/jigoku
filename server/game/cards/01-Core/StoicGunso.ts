import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class StoicGunso extends DrawCard {
    static id = 'stoic-gunso';

    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character for +3/+0',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'give himself +3{1}/+0{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyMilitarySkill(3) })
        });
    }
}


export default StoicGunso;
