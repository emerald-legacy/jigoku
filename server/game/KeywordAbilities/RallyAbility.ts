import { AbilityTypes, Locations } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { Event } from '../Events/Event.js';
export class RallyAbility extends TriggeredAbility {
    constructor(card: DrawCard) {
        super(card, AbilityTypes.KeywordReaction, {
            when: {
                onCardRevealed: (event: Event, context: TriggeredAbilityContext) =>
                    event.card === context.source &&
                    context.game.getProvinceArray().includes(event.card.location) &&
                    context.source.hasRally()
            },
            location: [
                Locations.StrongholdProvince,
                Locations.ProvinceOne,
                Locations.ProvinceTwo,
                Locations.ProvinceThree,
                Locations.ProvinceFour
            ],
            title: `${card.name}'s Rally`,
            printedAbility: false,
            message: '{0} places {1} faceup in {2} due to {3}\'s Rally',
            messageArgs: (context: TriggeredAbilityContext) => [
                context.player,
                context.player.dynastyDeck[0] ? context.player.dynastyDeck[0] : 'a card',
                context.player.getProvinceCardInProvince(context.source.location)?.isFacedown()
                    ? context.source.location
                    : context.player.getProvinceCardInProvince(context.source.location),
                context.source
            ],
            handler: (context: TriggeredAbilityContext) => {
                context.player.putTopDynastyCardInProvince(context.source.location);
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
