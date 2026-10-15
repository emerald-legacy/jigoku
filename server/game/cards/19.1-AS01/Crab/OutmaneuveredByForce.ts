import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Phase, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class OutmaneuveredByForce extends DrawCard {
    static id = 'outmaneuvered-by-force';

    public setupCardAbilities() {
        this.action('Declare a conflict right now')
            .playOnlyIf((context) => !context.game.isDuringConflict() && this.controlsBerserkerOrBigCharacter(context))
            .condition((context) => context.game.getConflicts(Players.All).every((conflict) => conflict.passed))
            .phase(Phase.Conflict)
            .initiateConflict({ canPass: false });
    }

    private controlsBerserkerOrBigCharacter(context: AbilityContext): boolean {
        return context.player.cardsInPlay.some(
            (card) =>
                card.type === CardType.Character && (card.hasTrait('berserker') || (card.printedMilitarySkill ?? 0) >= 5)
        );
    }
}
