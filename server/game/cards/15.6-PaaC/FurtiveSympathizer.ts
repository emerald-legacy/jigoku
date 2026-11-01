import DrawCard from '../../DrawCard.js';
import { switchBaseSkills } from '../../effects.js';
import { canSwitchSkills } from '../switchSkills.js';

class FurtiveSympathizer extends DrawCard {
    static id = 'furtive-sympathizer';

    override setupCardAbilities() {
        this.action('Switch each character\'s base skills')
            .condition((context) => context.source.isParticipating())
            .ifCondition((context) => context.source.isOrdinary())
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((a) => canSwitchSkills(a)) ?? [],
                effect: switchBaseSkills()
            }))
            .chatText('switch all participating character\'s base military and political skill');
    }
}


export default FurtiveSympathizer;
