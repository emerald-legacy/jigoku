import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class WarriorPoet extends DrawCard {
    static id = 'warrior-poet';

    setupCardAbilities() {
        this.action('Reduce skill of opponent\'s characters')
            .condition((context) => context.source.isParticipating())
            .cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: modifyBothSkills(-1)
            }))
            .chatText('reduce the skill of all opposing characters');
    }
}


export default WarriorPoet;
