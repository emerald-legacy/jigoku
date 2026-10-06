import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class PassionatePoet extends DrawCard {
    static id = 'passionate-poet';

    setupCardAbilities() {
        this.action('Give all participating enemies -1/-1')
            .condition((context) => context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getCharacters(context.player.opponent),
                effect: modifyBothSkills(-1)
            })))
            .effect(() => msg`give all participating enemies -1${'military'}/-1${'political'} until the end of the conflict`);
    }
}
