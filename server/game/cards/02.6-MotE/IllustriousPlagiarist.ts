import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations, Durations, Players, AbilityTypes, CardTypes } from '../../Constants.js';

class IllustriousPlagiarist extends DrawCard {
    static id = 'illustrious-plagiarist';

    setupCardAbilities() {
        this.action({
            title: 'Copy action abilty of opponent\'s top event',
            condition: (context: AbilityContext) => !!context.player.opponent &&
                context.player.opponent.conflictDiscardPile.some((card: any) => card.type === CardTypes.Event && card.abilities.actions.length > 0),
            target: {
                player: Players.Opponent,
                location: Locations.ConflictDiscardPile,
                controller: Players.Opponent,
                cardCondition: (card: any, context: AbilityContext) => card.location === Locations.ConflictDiscardPile &&
                    card.type === CardTypes.Event &&
                    card.controller === context.player.opponent &&
                    card.abilities.actions.length > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                    duration: Durations.UntilEndOfPhase,
                    target: context.source,
                    effect: (context.target as DrawCard).abilities.actions.map((action: any) => AbilityDsl.effects.gainAbility(AbilityTypes.Action, action))
                }))
            },
            effect: 'copy {0}\'s action abilities'
        });
    }
}


export default IllustriousPlagiarist;
