import DrawCard from '../../DrawCard.js';
import { Duration, TargetMode, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiYokuni extends DrawCard {
    static id = 'togashi-yokuni';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Copy another character\'s ability',
            target: {
                activePromptTitle: 'Select a character to copy from',
                mode: TargetMode.Ability,
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source,
                abilityCondition: ability => ability.printedAbility,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    duration: Duration.UntilEndOfPhase,
                    effect: ability.effects.gainAbility(context.targetAbility.abilityType, context.targetAbility)
                }))
            },
            effect: 'copy {1}\'s \'{2}\' ability',
            effectArgs: context => [context.targetAbility?.card ?? '', context.targetAbility?.title ?? ''],
            max: ability.limit.perRound(1)
        });
    }
}


export default TogashiYokuni;

