import { msg } from '../../GameChat.js';
import { costToDeclareAnyParticipants, modifyProvinceStrength } from '../../effects.js';
import { loseHonor } from '../../GameActions/GameActions.js';
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
            effect: modifyProvinceStrength(3)
        });

        this.persistentEffect({
            condition: (context) => !!context.source.parentProvince?.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            effect: costToDeclareAnyParticipants({
                type: 'defenders',
                chatText: () => msg`loses 1 honor`,
                cost: (player: Player) => loseHonor({
                    target: player
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
