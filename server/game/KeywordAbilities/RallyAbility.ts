import { AbilityType, EventName, Location } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
export class RallyAbility extends TriggeredAbility {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                onCardRevealed: (event: Event, context: TriggeredAbilityContext) => {
                    const revealed = event as GameEvent<EventName.OnCardRevealed>;
                    return revealed.card === context.source &&
                        !!revealed.card && context.game.getProvinceArray().includes(revealed.card.location) &&
                        (context.source as DrawCard).hasRally();
                }
            },
            location: [
                Location.StrongholdProvince,
                Location.ProvinceOne,
                Location.ProvinceTwo,
                Location.ProvinceThree,
                Location.ProvinceFour
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
