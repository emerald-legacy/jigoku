import { AbilityTypes, Locations, Phases } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { Event } from '../Events/Event.js';
export class ThrivingAbility extends TriggeredAbility {
    constructor(card: DrawCard) {
        super(card, AbilityTypes.KeywordInterrupt, {
            when: {
                onPhaseEnded: (event: Event, context: TriggeredAbilityContext<DrawCard>) =>
                    event.phase === Phases.Fate &&
                    context.source.hasThriving() &&
                    context.player.getDynastyCardsInProvince(context.source.location).length === 1
            },
            location: [
                Locations.StrongholdProvince,
                Locations.ProvinceOne,
                Locations.ProvinceTwo,
                Locations.ProvinceThree,
                Locations.ProvinceFour
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
