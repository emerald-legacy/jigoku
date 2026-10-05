import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { hasMoreParticipatingGlory } from '../participatingGlory.js';

class AsakoMaezawa extends DrawCard {
    static id = 'asako-maezawa';

    setupCardAbilities() {
        this.action('Double a character\'s base political skill')
            .condition((context) => context.source.isParticipating() && hasMoreParticipatingGlory(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyBasePoliticalSkillMultiplier(2)
            }))
            .effect('double {0}\'s base {1} skill', () => ['political']);
    }
}


export default AsakoMaezawa;
