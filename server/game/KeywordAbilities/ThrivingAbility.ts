import { AbilityType, EventName, Location, Phases } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
export class ThrivingAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordInterrupt, {
            when: {
                onPhaseEnded: (event: EventPayload<EventName.OnPhaseEnded>, context: TriggeredAbilityContext<DrawCard>) =>
                    event.phase === Phases.Fate &&
                    context.source.hasThriving() &&
                    context.player.getDynastyCardsInProvince(context.source.location).length === 1
            },
            location: [
                Location.StrongholdProvince,
                Location.ProvinceOne,
                Location.ProvinceTwo,
                Location.ProvinceThree,
                Location.ProvinceFour
            ],
            title: `${card.name}'s Thriving`,
            printedAbility: false,
            message: '{0} places a card facedown in {1} due to {2}\'s Thriving',
            messageArgs: (context: TriggeredAbilityContext<DrawCard>) => [
                context.player,
                context.player.getProvinceCardInProvince(context.source.location)?.isFacedown()
                    ? context.source.location
                    : context.player.getProvinceCardInProvince(context.source.location),
                context.source
            ],
            handler: (context: TriggeredAbilityContext<DrawCard>) => {
                context.player.putTopDynastyCardInProvince(context.source.location, true);
            }
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}
