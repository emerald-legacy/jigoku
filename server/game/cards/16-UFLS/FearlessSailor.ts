import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FearlessSailor extends DrawCard {
    static id = 'fearless-sailor';

    setupCardAbilities() {
        this.action('Move a fate from a character to a ring')
            .condition(context => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.hasStatusTokens && card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(-2)
            }))
            .effect('give {0} -2{1}', () => ['military']);
    }
}


export default FearlessSailor;
