import { doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class MotoChagatai extends DrawCard {
    static id = 'moto-chagatai';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAttacking() &&
                !!context.game.currentConflict?.brokenProvinces.some((province) => province.controller === context.player.opponent),
            effect: doesNotBow()
        });
    }
}
