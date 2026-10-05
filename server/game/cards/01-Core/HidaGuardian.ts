import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HidaGuardian extends DrawCard {
    static id = 'hida-guardian';

    setupCardAbilities() {
        this.action('Give a character a bonus for each holding')
            .condition(context => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.modifyBothSkills(2 * context.player.getNumberOfHoldingsInPlay())
            })))
            .effect('give {0} +{1}{2}/+{1}{3}', context => [2 * context.player.getNumberOfHoldingsInPlay(), 'military', 'political']);
    }
}


export default HidaGuardian;
