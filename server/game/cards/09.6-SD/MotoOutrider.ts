import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoOutrider extends DrawCard {
    static id = 'moto-outrider';

    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.source.isParticipating() && this.game.isDuringConflict('military'),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}


export default MotoOutrider;


