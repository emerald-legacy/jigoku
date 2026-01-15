import { AbilityTypes, Locations, Phases } from '../Constants';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext';
import type DrawCard from '../drawcard';
import type Game from '../game';
import TriggeredAbility from '../triggeredability';

export class ThrivingAbility extends TriggeredAbility {
    constructor(game: Game, card: DrawCard) {
        super(game, card, AbilityTypes.KeywordInterrupt, {
            when: {
                onPhaseEnded: (event: any, context: TriggeredAbilityContext<DrawCard>) =>
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
                context.player.getProvinceCardInProvince(context.source.location).isFacedown()
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
