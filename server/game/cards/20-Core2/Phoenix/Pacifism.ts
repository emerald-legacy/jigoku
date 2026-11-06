import { cannotParticipateAsAttacker, cannotParticipateAsDefender } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType } from '../../../Constants.js';

export default class Pacifism extends DrawCard {
    static id = 'pacifism';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                cannotParticipateAsAttacker(ConflictType.Military),
                cannotParticipateAsDefender(ConflictType.Military)
            ]
        });
    }
}
