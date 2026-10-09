import { resolveAbility } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Blocker } from '../../Constants.js';
import { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class TheMirrorsGaze extends DrawCard {
    static id = 'the-mirror-s-gaze';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.reaction('Mirror an opponent\'s event')
            .when({
                onCardAbilityTriggered: (event, context) => event.card.type === CardType.Event && !event.ability.cannotBeMirrored &&
                    event.context.player === context.player.opponent && !event.cancelled
            })
            .gameAction(resolveAbility((context) => ({
                target: context.event.card,
                ability: context.event.ability,
                ignoredBlockers: [Blocker.CannotPayCost, Blocker.ConditionNotMet, Blocker.LimitReached],
                event: context.event.context instanceof TriggeredAbilityContext ? context.event.context.event : undefined
            })));
    }
}


export default TheMirrorsGaze;
