import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiYokuni extends DrawCard {
    static id = 'togashi-yokuni';

    setupCardAbilities() {
        this.action('Copy another character\'s ability')
            .abilityTarget('target', {
                activePromptTitle: 'Select a character to copy from',
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source,
                abilityCondition: ability => ability.printedAbility
            }, AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                effect: context.targetAbility ? AbilityDsl.effects.gainAbility(context.targetAbility.abilityType, context.targetAbility) : []
            })))
            .effect('copy {1}\'s \'{2}\' ability', context => [context.targetAbility?.card ?? '', context.targetAbility?.title ?? ''])
            .max(AbilityDsl.limit.perRound(1));
    }
}


export default TogashiYokuni;

