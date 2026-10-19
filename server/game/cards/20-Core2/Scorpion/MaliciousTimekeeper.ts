import { forceConflictUnopposed } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class MaliciousTimekeeper extends DrawCard {
    static id = 'malicious-timekeeper';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && !!this.game.currentConflict?.isOnWinningSide(context.source),
            effect: forceConflictUnopposed()
        });
    }
}
