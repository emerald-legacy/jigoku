import { CardTypes, Players, Locations, TargetModes } from '../../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../basecard.js';
import DrawCard from '../../../drawcard.js';

export default class ToSowTheEarth extends DrawCard {
    static id = 'to-sow-the-earth';

    public setupCardAbilities() {
        this.action({
            title: 'Play a peasant from the discard pile',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                location: [Locations.ConflictDiscardPile, Locations.DynastyDiscardPile],
                mode: TargetModes.Single,
                cardCondition: (card) => card.hasTrait('peasant'),
                gameAction: AbilityDsl.actions.sequential([
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
                ])
            },
            effect: 'play {0} from their discard pile'
        });

        this.action({
            title: 'Place a province facedown',
            cost: AbilityDsl.costs.bow({
                cardCondition: (card: BaseCard) => card.hasTrait('peasant')
            }),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Any,
                cardCondition: (card) => card.isBroken === false,
                gameAction: AbilityDsl.actions.turnFacedown()
            },
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
