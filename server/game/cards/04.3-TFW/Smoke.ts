import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

class Smoke extends DrawCard {
    static id = 'smoke';

    setupCardAbilities() {
        this.action('Give non-unique characters -2/+0')
            .cost(costs.bowSelf())
            .cost(costs.sacrificeSelf())
            .condition((context) => !!(this.game.isDuringConflict() && context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((card) => !card.isUnique()) ?? [],
                effect: modifyMilitarySkill(-2)
            }))
            .chatText(() => msg`give all non-unique participating characters -2${'military'}`);
    }
}


export default Smoke;
