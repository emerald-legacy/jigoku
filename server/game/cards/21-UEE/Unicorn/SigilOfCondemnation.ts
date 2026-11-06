import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    override setupCardAbilities() {
        this.conflictAction('Injure attached character', { conflictType: ConflictType.Military })
            .ifCondition((context) =>
                !!(context.source.parentCharacter &&
                context.source.parentCharacter.controller.opponent &&
                context.game.currentConflict?.hasMoreParticipants(context.source.parentCharacter.controller.opponent)))
            .injure((context) => ({ target: context.source.parentCharacter ?? [] }));
    }
}
