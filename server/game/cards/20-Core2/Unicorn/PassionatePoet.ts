import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class PassionatePoet extends DrawCard {
    static id = 'passionate-poet';

    setupCardAbilities() {
        this.action('Give all participating enemies -1/-1')
            .condition((context) => context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getCharacters(context.player.opponent),
                effect: modifyBothSkills(-1)
            })))
            .effect('give all participating enemies -1{1}/-1{2} until the end of the conflict', () => ['military', 'political']);
    }
}
