import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoOutrider extends DrawCard {
    static id = 'shinjo-outrider';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move this character to conflict',
            gameAction: ability.actions.moveToConflict()
        });
    }
}


export default ShinjoOutrider;
