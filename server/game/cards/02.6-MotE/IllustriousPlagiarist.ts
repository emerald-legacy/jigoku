import AbilityDsl from '../../abilitydsl.js';
import type { CardAction } from '../../CardAction.js';
import DrawCard from '../../DrawCard.js';
import { Location, Duration, Players, AbilityType, CardType } from '../../Constants.js';

class IllustriousPlagiarist extends DrawCard {
    static id = 'illustrious-plagiarist';

    setupCardAbilities() {
        this.action('Copy action abilty of opponent\'s top event')
            .condition((context) => !!context.player.opponent &&
                context.player.opponent.conflictDiscardPile.some((card) => card.type === CardType.Event && card.abilities.actions.length > 0))
            .target('target', {
                player: Players.Opponent,
                location: Location.ConflictDiscardPile,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.location === Location.ConflictDiscardPile &&
                    card.type === CardType.Event &&
                    card.controller === context.player.opponent &&
                    card.abilities.actions.length > 0
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.source,
                effect: context.target?.abilities.actions.map((action: CardAction) => AbilityDsl.effects.gainAbility(AbilityType.Action, action)) ?? []
            })))
            .effect('copy {0}\'s action abilities');
    }
}


export default IllustriousPlagiarist;
