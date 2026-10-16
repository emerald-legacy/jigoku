import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class IkomaAnakazu extends DrawCard {
    static id = 'ikoma-anakazu';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                !!(context.source.isParticipating() &&
                context.player.opponent &&
                context.game.getConflicts(context.player.opponent).some((record) => record.brokenProvinces.length > 0)),
            effect: modifyBothSkills(3)
        });
    }
}
