import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { perConflict } from '../../../AbilityLimit.js';
import { changePlayerResolutionSkillModifier } from '../../../effects.js';
import { CardType, ConflictType, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MarvelousBeings extends DrawCard {
    static id = 'marvelous-beings';

    public override setupCardAbilities() {
        this.conflictAction('Move character to conflict and gain skill bonus', { conflictType: ConflictType.Political })
            .cost(costs.moveToConflict({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.type === CardType.Character && (card.hasTrait(Trait.Spirit) || card.hasTrait(Trait.Creature))
            }))
            .playerLastingEffect((context) => ({
                target: Players.Self,
                effect: changePlayerResolutionSkillModifier(this.marvelousSkillBonus(context.costs.moveToConflict))
            }))
            .chatText((context) => msg`entrance the court, giving their side an extra ${this.marvelousSkillBonus(context.costs.moveToConflict)}${'political'} during this conflict's resolution`)
            .max(perConflict(1));
    }

    private marvelousSkillBonus(movedCharacter: DrawCard | undefined): number {
        if(!movedCharacter) {
            return 0;
        }
        const bonus = Math.min(movedCharacter.printedCost ?? NaN, 3);
        return isNaN(bonus) ? 0 : bonus;
    }
}
