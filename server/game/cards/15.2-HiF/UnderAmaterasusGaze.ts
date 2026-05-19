import { Players, PlayTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';

export default class UnderAmaterasusGaze extends BattlefieldAttachment {
    static id = 'under-amaterasu-s-gaze';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: (context) =>
                context.source.parent &&
                context.game.isDuringConflict() &&
                context.source.parent.isConflictProvince() &&
                context.player.opponent &&
                context.player.opponent.honor < context.player.honor + 5,
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });

        this.persistentEffect({
            condition: (context) =>
                context.source.parent &&
                context.game.isDuringConflict() &&
                context.source.parent.isConflictProvince() &&
                context.player.opponent &&
                context.player.honor < context.player.opponent.honor + 5,
            targetController: Players.Self,
            effect: AbilityDsl.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });
    }
}
