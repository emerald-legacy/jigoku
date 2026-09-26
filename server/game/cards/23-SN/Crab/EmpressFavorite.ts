import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class EmpressFavorite extends DrawCard {
    static id = 'empress-favorite';

    setupCardAbilities() {
        this.conflictAction('Take 1 honor', { conflictType: 'political' })
            .condition((context) => context.source.isDefending() &&
                !!context.player.opponent &&
                !context.player.opponent.hasDeclaredConflictOfType(context, ConflictType.Military))
            .gameAction(AbilityDsl.actions.takeHonor());
    }
}
