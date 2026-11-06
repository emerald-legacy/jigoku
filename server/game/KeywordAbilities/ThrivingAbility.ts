import { msg } from '../GameChat.js';
import * as AbilityLimit from '../AbilityLimit.js';
import { AbilityType, type EventName, Location, Phase } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { TriggeredAbility } from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
export class ThrivingAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordInterrupt, {
            when: {
                onPhaseEnded: (event: EventPayload<EventName.OnPhaseEnded>, context: TriggeredAbilityContext<DrawCard>) =>
                    event.phase === Phase.Fate &&
                    context.source.hasThriving() &&
                    context.player.getDynastyCardsInProvince(context.source.location).length === 1
            },
            location: Location.Provinces,
            limit: AbilityLimit.unlimited(),
            title: `${card.name}'s Thriving`,
            printedAbility: false,
            message: (context: TriggeredAbilityContext<DrawCard>) => {
                const province = context.player.getProvinceCardInProvince(context.source.location);
                return msg`${context.player} places a card facedown in ${province?.isFacedown() ? context.source.location : province} due to ${context.source}'s Thriving`;
            },
            handler: (context: TriggeredAbilityContext<DrawCard>) => {
                context.player.putTopDynastyCardInProvince(context.source.location, true);
            }
        });
    }

    override isTriggeredAbility() {
        return false;
    }

    override isKeywordAbility() {
        return true;
    }
}
