import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StoicGunso extends DrawCard {
    static id = 'stoic-gunso';

    setupCardAbilities() {
        this.action('Sacrifice a character for +3/+0')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.modifyMilitarySkill(3) }))
            .effect('give himself +3{1}/+0{2}', () => ['military', 'political']);
    }
}


export default StoicGunso;
