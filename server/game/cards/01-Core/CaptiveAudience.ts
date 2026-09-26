import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class CaptiveAudience extends DrawCard {
    static id = 'captive-audience';

    setupCardAbilities() {
        this.action('Change the conflict to military')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(() => this.game.isDuringConflict('political'))
            .handler(() => this.game.currentConflict?.switchType())
            .effect('switch the conflict type to {1}', () => 'military');
    }
}


export default CaptiveAudience;
