import type { AbilityContext } from '../../AbilityContext.js';
import { gainAbility } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import type { CardAction } from '../../CardAction.js';
import DrawCard from '../../DrawCard.js';
import { Location, Duration, Players, AbilityType, CardType } from '../../Constants.js';

class IllustriousPlagiarist extends DrawCard {
    static id = 'illustrious-plagiarist';

    setupCardAbilities() {
        this.action('Copy action ability of opponent\'s top event')
            .target({
                location: Location.ConflictDiscardPile,
                controller: Players.Opponent,
                cardCondition: (card, context) => card === this.topmostEvent(context) && card.abilities.actions.length > 0
            }, cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.source,
                effect: context.target?.abilities.actions.map((action: CardAction) => gainAbility(AbilityType.Action, action)) ?? []
            })))
            .chatText('copy {0}\'s action abilities');
    }

    private topmostEvent(context: AbilityContext): DrawCard | undefined {
        return context.player.opponent?.conflictDiscardPile.find((card) => card.type === CardType.Event);
    }
}


export default IllustriousPlagiarist;
