import * as costs from '../../../costs/index.js';
import { perConflict } from '../../../AbilityLimit.js';
import { changePlayerSkillModifier } from '../../../effects.js';
import { CardType, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MarvelousBeings extends DrawCard {
    static id = 'marvelous-beings';

    public setupCardAbilities() {
        this.action('Move character to conflict and gain skill bonus')
            .cost(costs.moveToConflict({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.type === CardType.Character && (card.hasTrait('spirit') || card.hasTrait('creature'))
            }))
            .condition((context) => context.game.isDuringConflict(ConflictType.Political))
            .playerLastingEffect((context) => ({
                target: context.player,
                effect: changePlayerSkillModifier(this.marvelousSkillBonus(context.costs.moveToConflict))
            }))
            .chatText('entrance the court, giving their side an extra {1}{2} this conflict', (context) => [this.marvelousSkillBonus(context.costs.moveToConflict), 'political'])
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
