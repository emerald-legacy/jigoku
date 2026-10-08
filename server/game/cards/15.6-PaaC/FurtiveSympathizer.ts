import DrawCard from '../../DrawCard.js';
import { switchBaseSkills } from '../../effects.js';

class FurtiveSympathizer extends DrawCard {
    static id = 'furtive-sympathizer';

    setupCardAbilities() {
        this.action('Switch each character\'s base skills')
            .condition((context) => context.source.isParticipating() && context.source.isOrdinary())
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((a) => !a.hasDash()) ?? [],
                effect: switchBaseSkills()
            }))
            .chatText('switch all participating character\'s base military and political skill');
    }
}


export default FurtiveSympathizer;
