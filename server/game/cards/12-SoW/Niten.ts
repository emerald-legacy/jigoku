import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perRound } from '../../AbilityLimit.js';
import { captureParentCost, capturedParent } from '../captureParentCost.js';

class Niten extends DrawCard {
    static id = 'niten';

    override setupCardAbilities() {
        this.attachmentConditions({
            faction: 'dragon'
        });

        this.action('Put an attachment into play')
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .cost(captureParentCost())
            .cost(costs.returnSelfToHand())
            .target({
                cardType: CardType.Attachment,
                controller: Players.Self,
                location: Location.Hand,
                cardCondition: (card, context) => card.canAttach(capturedParent(context) ?? undefined)
            })
            .attach((context) => ({
                target: capturedParent(context) ?? [],
                attachment: context.target
            }))
            .max(perRound(1));
    }
}


export default Niten;
