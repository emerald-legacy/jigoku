import { Players } from '../../Constants.js';
import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class IkomaAnakazu extends DrawCard {
    static id = 'ikoma-anakazu';

    public override setupCardAbilities() {
        // the opponent is considered to have broken any of your provinces, also outside conflict resolution (ruling #634)
        this.persistentEffect({
            condition: (context) =>
                context.source.isParticipating() &&
                context.game.getConflicts(Players.All).some((record) =>
                    record.brokenProvinces.some((province) => province.controller === context.player)),
            effect: modifyBothSkills(3)
        });
    }
}
