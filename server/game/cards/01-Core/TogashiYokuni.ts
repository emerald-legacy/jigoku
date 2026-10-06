import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { gainAbility } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class TogashiYokuni extends DrawCard {
    static id = 'togashi-yokuni';

    setupCardAbilities() {
        this.action('Copy another character\'s ability')
            .abilityTarget({
                activePromptTitle: 'Select a character to copy from',
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source,
                abilityCondition: ability => ability.printedAbility
            }, cardLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                effect: context.targetAbility ? gainAbility(context.targetAbility.abilityType, context.targetAbility) : []
            })))
            .effect((context) => msg`copy ${context.targetAbility.card}'s '${context.targetAbility.title}' ability`)
            .max(AbilityDsl.limit.perRound(1));
    }
}


export default TogashiYokuni;

