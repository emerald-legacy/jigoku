import { CardType, Players, Location } from '../../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

export default class ToSowTheEarth extends DrawCard {
    static id = 'to-sow-the-earth';

    public setupCardAbilities() {
        this.action('Play a peasant from the discard pile')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait('peasant')
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.target,
                    effect: [
                        AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand),
                        AbilityDsl.effects.gainPlayAction(PlayDisguisedCharacterAsIfFromHand)
                    ]
                })),
                AbilityDsl.actions.playCard((context) => ({
                    target: context.target
                }))
            ]))
            .effect('play {0} from their discard pile');

        this.action('Place a province facedown')
            .cost(AbilityDsl.costs.bow({
                cardCondition: (card: BaseCard) => card.hasTrait('peasant')
            }))
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Any,
                cardCondition: (card) => (card).isBroken === false
            }, AbilityDsl.actions.turnFacedown())
            .max(AbilityDsl.limit.perRound(1));
    }
}
