import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class EmpressFavorite extends DrawCard {
    static id = 'empress-favorite';

    setupCardAbilities() {
        this.conflictAction('Take 1 honor', { conflictType: ConflictType.Political })
            .condition((context) => context.source.isDefending() &&
                !!context.player.opponent &&
                !context.player.opponent.hasDeclaredConflictOfType(context, ConflictType.Military))
            .takeHonor();
    }
}
