import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ReinforcedPlate extends DrawCard {
    static id = 'reinforced-plate';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.attachedCharacter !== null && context.source.attachedCharacter !== undefined && context.source.attachedCharacter.isParticipating() && this.game.isDuringConflict('military'),
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsEvents'
            })
        });
    }
}


export default ReinforcedPlate;
