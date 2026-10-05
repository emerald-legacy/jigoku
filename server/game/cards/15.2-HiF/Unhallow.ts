import AbilityDsl from '../../abilitydsl.js';
import { Location, Players } from '../../Constants.js';
import type Player from '../../Player.js';
import { ProvinceAttachment } from '../ProvinceAttachment.js';

class Unhallow extends ProvinceAttachment {
    static id = 'unhallow';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card, context) => card === context?.source.parent,
            effect: AbilityDsl.effects.modifyProvinceStrength(3)
        });

        this.persistentEffect({
            condition: (context) => !!context.source.parentProvince?.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            effect: AbilityDsl.effects.costToDeclareAnyParticipants({
                type: 'defenders',
                message: 'loses 1 honor',
                cost: (player: Player) => AbilityDsl.actions.loseHonor({
                    target: player,
                    amount: 1
                })
            })
        });
    }

    protected controllerProvinceOnly(): boolean {
        return true;
    }

    isTemptationsMaho() {
        return true;
    }
}


export default Unhallow;
