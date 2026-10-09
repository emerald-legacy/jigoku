import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType } from '../../../Constants.js';

export default class ArrowsFromTheWoods extends DrawCard {
    static id = 'arrows-from-the-woods';

    public setupCardAbilities() {
        this.action('Reduce opponent\'s characters mil')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Military) &&
                context.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('bushi')))
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: modifyMilitarySkill(this.penaltyValue(context))
            }))
            .chatText((context) => msg`give ${context.player.opponent}'s participating characters ${this.penaltyValue(context)}${'military'}`)
            .max(perConflict(1));
    }

    private penaltyValue(context: AbilityContext): number {
        const hasScoutOrShinobiParticipating = context.player.anyCardsInPlay(
            (card) => card.isParticipating() && card.hasSomeTrait('scout', 'shinobi')
        );
        return hasScoutOrShinobiParticipating ? -2 : -1;
    }
}
