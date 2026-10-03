import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { captureParentCost } from '../captureParentCost.js';

class Niten extends DrawCard {
    static id = 'niten';

    setupCardAbilities() {
        this.attachmentConditions({
            faction: 'dragon'
        });

        this.action('Put an attachment into play')
            .cost(captureParentCost())
            .cost(AbilityDsl.costs.returnSelfToHand())
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Self,
                location: Location.Hand,
                cardCondition: (card, context) => card.canAttach(context.source.parentCharacter ?? undefined) || card.canAttach(context.costs.captureParentCost ?? undefined)
            })
            .gameAction(AbilityDsl.actions.attach((context) => ({
                target: context.costs.captureParentCost ?? [],
                attachment: context.target
            })))
            .max(AbilityDsl.limit.perRound(1));
    }
}


export default Niten;
