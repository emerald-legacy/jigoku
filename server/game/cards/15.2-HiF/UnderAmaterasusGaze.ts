import { Players, PlayType } from '../../Constants.js';
import { increaseCost } from '../../effects.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';

export default class UnderAmaterasusGaze extends BattlefieldAttachment {
    static id = 'under-amaterasu-s-gaze';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: (context) =>
                !!context.source.parent &&
                context.game.isDuringConflict() &&
                !!context.source.parentProvince?.isConflictProvince() &&
                !!context.player.opponent &&
                context.player.opponent.honor < context.player.honor + 5,
            targetController: Players.Opponent,
            effect: increaseCost({
                amount: 1,
                playingTypes: PlayType.PlayFromHand
            })
        });

        this.persistentEffect({
            condition: (context) =>
                !!context.source.parent &&
                context.game.isDuringConflict() &&
                !!context.source.parentProvince?.isConflictProvince() &&
                !!context.player.opponent &&
                context.player.honor < context.player.opponent.honor + 5,
            targetController: Players.Self,
            effect: increaseCost({
                amount: 1,
                playingTypes: PlayType.PlayFromHand
            })
        });
    }
}
