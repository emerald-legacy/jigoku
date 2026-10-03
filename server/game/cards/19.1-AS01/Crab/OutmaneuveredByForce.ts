import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Phases, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class OutmaneuveredByForce extends DrawCard {
    static id = 'outmaneuvered-by-force';

    public setupCardAbilities() {
        this.action('Declare a conflict right now')
            .condition((context) => context.game.getConflicts(Players.All).every((conflict) => conflict.passed))
            .gameAction(AbilityDsl.actions.initiateConflict({ canPass: false }))
            .phase(Phases.Conflict);
    }

    public canPlay(context: AbilityContext, playType: string): boolean {
        return (
            !context.game.isDuringConflict() &&
            this.controlsBerserkerOrBigCharacter(context) &&
            super.canPlay(context, playType)
        );
    }

    private controlsBerserkerOrBigCharacter(context: AbilityContext): boolean {
        return context.player.cardsInPlay.some(
            (card) =>
                card.getType() === CardType.Character && (card.hasTrait('berserker') || (card.printedMilitarySkill ?? 0) >= 5)
        );
    }
}
