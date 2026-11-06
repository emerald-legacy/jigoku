import { CardType, Players, Location, PlayType, Trait } from '../../../Constants.js';
import { asIfFromHandPlayActions } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { playCard, turnFacedown } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ToSowTheEarth extends DrawCard {
    static id = 'to-sow-the-earth';

    public override setupCardAbilities() {
        this.action('Play a peasant from the discard pile')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait(Trait.Peasant)
            }, playCard((context) => ({
                target: context.target,
                playAction: context.target ? asIfFromHandPlayActions(context.target) : undefined,
                playType: PlayType.PlayFromHand
            })))
            .chatText('play {0} from their discard pile');

        this.action('Place a province facedown')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Peasant)
            }))
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Any,
                cardCondition: (card) => card.isBroken === false
            }, turnFacedown())
            .max(perRound(1));
    }
}
