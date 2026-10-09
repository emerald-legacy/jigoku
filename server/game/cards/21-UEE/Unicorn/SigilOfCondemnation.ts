import { ConflictType } from '../../../Constants.js';
import { injure } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.conflictAction('Injure attached character', { conflictType: ConflictType.Military })
            .condition((context) =>
                !!(context.source.parentCharacter &&
                context.source.parentCharacter.controller.opponent &&
                context.game.currentConflict?.hasMoreParticipants(context.source.parentCharacter.controller.opponent, () => true)))
            .gameAction(injure((context) => ({ target: context.source.parentCharacter ?? [] })));
    }
}
