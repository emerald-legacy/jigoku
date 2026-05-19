import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ReveredIkoma extends DrawCard {
    static id = 'revered-ikoma';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card === this,
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });

        this.action({
            title: 'Gain 1 fate',
            condition: context => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2,
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}


export default ReveredIkoma;
