import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ArrowsFromTheWoods extends DrawCard {
    static id = 'arrows-from-the-woods';

    public setupCardAbilities() {
        this.action({
            title: 'Reduce opponent\'s characters mil',
            condition: (context) =>
                context.game.isDuringConflict('military') &&
                context.player.anyCardsInPlay((card: DrawCard) => card.isParticipating() && card.hasTrait('bushi')),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: AbilityDsl.effects.modifyMilitarySkill(this.penaltyValue(context))
            })),
            effect: 'give {1}\'s participating characters {2}{3}',
            effectArgs: (context) => [context.player.opponent as any, this.penaltyValue(context), 'military'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    private penaltyValue(context: AbilityContext): number {
        const hasScoutOrShinobiParticipating = context.player.anyCardsInPlay(
            (card: DrawCard) => card.isParticipating() && card.hasSomeTrait('scout', 'shinobi')
        );
        return hasScoutOrShinobiParticipating ? -2 : -1;
    }
}
