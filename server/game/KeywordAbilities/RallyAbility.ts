import { AbilityTypes, Locations } from '../Constants';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext';
import type DrawCard from '../drawcard';
import type Game from '../game';
import TriggeredAbility from '../triggeredability';

export class RallyAbility extends TriggeredAbility {
    constructor(game: Game, card: DrawCard) {
        super(game, card, AbilityTypes.KeywordReaction, {
            when: {
                onCardRevealed: (event: any, context: TriggeredAbilityContext) =>
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
                context.player.getProvinceCardInProvince(context.source.location).isFacedown()
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
