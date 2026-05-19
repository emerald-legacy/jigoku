import DrawCard from '../../drawcard.js';

class StolenBreath extends DrawCard {
    static id = 'stolen-breath';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cannotParticipateAsAttacker('political'),
                ability.effects.cannotParticipateAsDefender('political')
            ]
        });
    }

    canPlay(context, playType) {
        if(this.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default StolenBreath;
