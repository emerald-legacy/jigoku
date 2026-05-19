import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class Pacifism extends DrawCard {
    static id = 'pacifism';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker('military'),
                AbilityDsl.effects.cannotParticipateAsDefender('military')
            ]
        });
    }
}
