import { CardType, type EffectName, Players } from '../../Constants.js';
import type { GameObject } from '../../GameObject.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cannotApplyLastingEffects, suppressEffects } from '../../effects.js';
import type { EffectApplier } from '../../Effects/EffectApplier.js';

export default class FestivalOfTheDeparted extends ProvinceCard {
    static id = 'festival-of-the-departed';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            match: (card) => card.type === CardType.Character,
            targetController: Players.Any,
            effect: [
                suppressEffects((effect) => this.isEventSkillIncrease(effect)),
                cannotApplyLastingEffects((effect) => this.isEventSkillIncrease(effect))
            ]
        });
    }

    // a computed value (Subdue the Spirits: +glory) has no value without a character, so check each one
    private isEventSkillIncrease(effect: EffectApplier<EffectName, GameObject, unknown>): boolean {
        const isIncrease = (value: unknown) => typeof value === 'number' && value > 0;
        return effect.context.source.type === CardType.Event && effect.isSkillModifier() && (
            isIncrease(effect.getValue()) ||
            this.game.findAnyCardsInPlay((card) => card.type === CardType.Character).some((card) => isIncrease(effect.getValue(card)))
        );
    }
}
