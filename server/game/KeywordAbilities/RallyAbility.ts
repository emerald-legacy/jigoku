import { msg } from '../GameChat.js';
import { AbilityType, EventName, Location } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { TriggeredAbility } from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
export class RallyAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                onCardRevealed: (event: EventPayload<EventName.OnCardRevealed>, context: TriggeredAbilityContext<DrawCard>) => {
                    const revealed = event;
                    return revealed.card === context.source &&
                        !!revealed.card && context.game.getProvinceArray().includes(revealed.card.location) &&
                        context.source.hasRally();
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
            message: (context: TriggeredAbilityContext) => {
                const province = context.player.getProvinceCardInProvince(context.source.location);
                return msg`${context.player} places ${context.player.dynastyDeck[0] ?? 'a card'} faceup in ${province?.isFacedown() ? context.source.location : province} due to ${context.source}'s Rally`;
            },
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
