import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';

class DesperateNegotiator extends DrawCard {
    static id = 'desperate-negotiator';

    setupCardAbilities() {
        this.dire({
            effect: modifyBothSkills(2)
        });
    }
}


export default DesperateNegotiator;

