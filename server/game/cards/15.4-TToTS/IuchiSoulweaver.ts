import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class IuchiSoulweaver extends DrawCard {
    static id = 'iuchi-soulweaver';

    setupCardAbilities() {
        this.dire({
            condition: context => context.game.isDuringConflict() && context.game.currentConflict.getNumberOfParticipantsFor(context.player, card => card !== context.source) > 0,
            effect: AbilityDsl.effects.participatesFromHome()
        });

        this.dire({
            condition: context => context.source.isAtHome(),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default IuchiSoulweaver;
