import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyBasePoliticalSkillMultiplier } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { hasMoreParticipatingGlory } from '../participatingGlory.js';

class AsakoMaezawa extends DrawCard {
    static id = 'asako-maezawa';

    setupCardAbilities() {
        this.action('Double a character\'s base political skill')
            .condition((context) => context.source.isParticipating() && hasMoreParticipatingGlory(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyBasePoliticalSkillMultiplier(2)
            }))
            .chatText('double {0}\'s base {1} skill', () => ['political']);
    }
}


export default AsakoMaezawa;
