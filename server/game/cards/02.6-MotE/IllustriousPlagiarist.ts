import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Duration, Players, AbilityType, CardType } from '../../Constants.js';

class IllustriousPlagiarist extends DrawCard {
    static id = 'illustrious-plagiarist';

    setupCardAbilities() {
        this.action({
            title: 'Copy action abilty of opponent\'s top event',
            condition: (context: AbilityContext) => !!context.player.opponent &&
                context.player.opponent.conflictDiscardPile.some((card: any) => card.type === CardType.Event && card.abilities.actions.length > 0),
            target: {
                player: Players.Opponent,
                location: Location.ConflictDiscardPile,
                controller: Players.Opponent,
                cardCondition: (card: any, context: AbilityContext) => card.location === Location.ConflictDiscardPile &&
                    card.type === CardType.Event &&
                    card.controller === context.player.opponent &&
                    card.abilities.actions.length > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    duration: Duration.UntilEndOfPhase,
                    target: context.source,
                    effect: context.target?.abilities.actions.map((action: any) => AbilityDsl.effects.gainAbility(AbilityType.Action, action)) ?? []
                }))
            },
            effect: 'copy {0}\'s action abilities'
        });
    }
}


export default IllustriousPlagiarist;
