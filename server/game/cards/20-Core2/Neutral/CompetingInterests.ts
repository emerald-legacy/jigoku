import { CardType } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class CompetingInterests extends DrawCard {
    static id = 'competing-interests';

    override setupCardAbilities() {
        this.conflictAction('Bow a character')
            .ifCondition((context) => this.hasEnoughUniques(context))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique() && card.isParticipating()
            }, bow());
    }

    private hasEnoughUniques(ctx: AbilityContext) {
        const enemySide = ctx.game.currentConflict?.getCharacters(ctx.player.opponent) ?? [];
        const uniques = enemySide.flatMap((card) => [card, ...card.attachments]).filter((card) => card.isUnique());
        return uniques.length >= 2;
    }
}
