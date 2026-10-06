import DrawCard from '../../DrawCard.js';
import { switchBaseSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class FurtiveSympathizer extends DrawCard {
    static id = 'furtive-sympathizer';

    setupCardAbilities() {
        this.action('Switch each character\'s base skills')
            .condition(context => context.source.isParticipating() && context.source.isOrdinary())
            .gameAction(cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants().filter((a) => !a.hasDash()) ?? [],
                effect: switchBaseSkills()
            })))
            .effect('switch all participating character\'s base military and political skill');
    }
}


export default FurtiveSympathizer;
