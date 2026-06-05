import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import type StaticEffect from '../../Effects/StaticEffect.js';

export default class FestivalOfTheDeparted extends ProvinceCard {
    static id = 'festival-of-the-departed';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            match: (card) => card.type === CardType.Character,
            targetController: Players.Any,
            effect: [
                AbilityDsl.effects.suppressEffects((rawEffect: unknown) => {
                    const effect = rawEffect as StaticEffect;
                    return (effect.context.source as BaseCard).type === CardType.Event &&
                        effect.isSkillModifier() &&
                        effect.getValue<number>() > 0;
                }),
                AbilityDsl.effects.cannotApplyLastingEffects(
                    (effect: StaticEffect) =>
                        (effect.context.source as BaseCard).type === CardType.Event &&
                        effect.isSkillModifier() &&
                        effect.getValue<number>() > 0
                )
            ]
        });
    }
}
