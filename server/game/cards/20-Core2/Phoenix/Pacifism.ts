import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType } from '../../../Constants.js';

export default class Pacifism extends DrawCard {
    static id = 'pacifism';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker(ConflictType.Military),
                AbilityDsl.effects.cannotParticipateAsDefender(ConflictType.Military)
            ]
        });
    }
}
