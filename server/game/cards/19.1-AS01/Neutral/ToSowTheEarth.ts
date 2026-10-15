import { CardType, Players, Location } from '../../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { gainPlayAction } from '../../../effects.js';
import { cardLastingEffect, playCard, sequential, turnFacedown } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ToSowTheEarth extends DrawCard {
    static id = 'to-sow-the-earth';

    public setupCardAbilities() {
        this.action('Play a peasant from the discard pile')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait('peasant')
            }, sequential([
                cardLastingEffect((context) => ({
                    target: context.target,
                    effect: [
                        gainPlayAction(PlayCharacterAsIfFromHand),
                        gainPlayAction(PlayDisguisedCharacterAsIfFromHand)
                    ]
                })),
                playCard((context) => ({
                    target: context.target
                }))
            ]))
            .chatText('play {0} from their discard pile');

        this.action('Place a province facedown')
            .cost(costs.bow({
                cardCondition: (card) => card.hasTrait('peasant')
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
