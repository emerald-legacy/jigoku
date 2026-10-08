import DrawCard from '../../DrawCard.js';
import { doesNotBow, participatesFromHome } from '../../effects.js';

class IuchiSoulweaver extends DrawCard {
    static id = 'iuchi-soulweaver';

    setupCardAbilities() {
        this.dire({
            condition: (context) => (context.game.currentConflict?.getNumberOfParticipantsFor(context.player, (card) => card !== context.source) ?? 0) > 0,
            effect: participatesFromHome()
        });

        this.dire({
            condition: (context) => context.source.isAtHome(),
            effect: doesNotBow()
        });
    }
}


export default IuchiSoulweaver;
