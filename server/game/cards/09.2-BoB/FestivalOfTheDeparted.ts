import { CardTypes, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FestivalOfTheDeparted extends ProvinceCard {
    static id = 'festival-of-the-departed';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            match: (card) => card.type === CardTypes.Character,
            targetController: Players.Any,
            effect: [
                AbilityDsl.effects.suppressEffects(
                    (effect: any) =>
                        effect.context.source.type === CardTypes.Event &&
                        effect.isSkillModifier() &&
                        effect.getValue() > 0
                ),
                AbilityDsl.effects.cannotApplyLastingEffects(
                    (effect: any) =>
                        effect.context.source.type === CardTypes.Event &&
                        effect.isSkillModifier() &&
                        effect.getValue() > 0
                )
            ]
        });
    }
}
