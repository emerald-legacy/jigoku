import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class ShinjoShono extends DrawCard {
    static id = 'shinjo-shono';

    setupCardAbilities() {
        this.action('Increase skill of friendly cavalry')
            .condition((context) => context.source.isParticipating() &&
                                  (context.game.currentConflict?.hasMoreParticipants(context.player) ?? false))
            .cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player).filter(card => card.hasTrait('cavalry')) ?? [],
                effect: modifyBothSkills(1)
            }))
            .chatText('give friendly, participating cavalry +1/+1');
    }
}


export default ShinjoShono;
