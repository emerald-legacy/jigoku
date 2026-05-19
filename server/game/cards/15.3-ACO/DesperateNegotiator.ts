import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class DesperateNegotiator extends DrawCard {
    static id = 'desperate-negotiator';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });
    }
}


export default DesperateNegotiator;

