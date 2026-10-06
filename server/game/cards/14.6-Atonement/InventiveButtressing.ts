import { modifyProvinceStrength } from '../../effects.js';
import { Location } from '../../Constants.js';
import { ProvinceAttachment } from '../ProvinceAttachment.js';

class InventiveButtressing extends ProvinceAttachment {
    static id = 'inventive-buttressing';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('military'),
            targetLocation: Location.Provinces,
            match: (card, context) => card === context?.source.parent,
            effect: modifyProvinceStrength(3)
        });
    }

    protected controllerProvinceOnly(): boolean {
        return true;
    }
}


export default InventiveButtressing;
