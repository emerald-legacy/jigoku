import type { AbilityContext } from '../../../AbilityContext.js';
import { initiateConflict } from '../../../GameActions/GameActions.js';
import { CardType, Phase, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class OutmaneuveredByForce extends DrawCard {
    static id = 'outmaneuvered-by-force';

    public setupCardAbilities() {
        this.action('Declare a conflict right now')
            .condition((context) => context.game.getConflicts(Players.All).every((conflict) => conflict.passed))
            .gameAction(initiateConflict({ canPass: false }))
            .phase(Phase.Conflict);
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
