import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';

export default class MakeshiftWarCamp extends BattlefieldAttachment {
    static id = 'makeshift-war-camp';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: (context) =>
                context.source.parent && context.game.isDuringConflict() && context.source.parent.isConflictProvince(),
            targetController: Players.Self,
            match: (card) => card.isParticipating() && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}
