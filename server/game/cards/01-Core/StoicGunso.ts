import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class StoicGunso extends DrawCard {
    static id = 'stoic-gunso';

    setupCardAbilities() {
        this.action('Sacrifice a character for +3/+0')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .condition(() => this.game.isDuringConflict())
            .gameAction(cardLastingEffect({ effect: modifyMilitarySkill(3) }))
            .effect('give himself +3{1}/+0{2}', () => ['military', 'political']);
    }
}


export default StoicGunso;
