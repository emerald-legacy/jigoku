import { resolveAbility } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType, Blocker, Stage, Trait } from '../../Constants.js';
import { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class TheMirrorsGaze extends DrawCard {
    static id = 'the-mirror-s-gaze';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: Trait.Shugenja
        });

        this.reaction('Mirror an opponent\'s event')
            .when({
                onCardAbilityTriggered: (event, context) => event.card.type === CardType.Event && !event.ability.cannotBeMirrored &&
                    event.ability.abilityType !== AbilityType.DuelReaction &&
                    event.context.player === context.player.opponent && !event.cancelled &&
                    // a cancelled event's effects never initiate, so they never resolve
                    event.context.stage === Stage.Effect
            })
            .gameAction(resolveAbility((context) => ({
                target: context.event.card,
                ability: context.event.ability,
                // costs and triggering conditions ("If …") are ignored; "During/While" play restrictions must be met (developer ruling)
                ignoredBlockers: [Blocker.CannotPayCost, Blocker.IfConditionNotMet, Blocker.LimitReached],
                event: context.event.context instanceof TriggeredAbilityContext ? context.event.context.event : undefined
            })));
    }
}


export default TheMirrorsGaze;
