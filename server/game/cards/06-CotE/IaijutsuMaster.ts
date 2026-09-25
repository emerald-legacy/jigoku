import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import { EventName } from '../../Constants.js';
import { Direction } from '../../GameActions/ModifyBidAction.js';

class IaijutsuMaster extends DrawCard {
    static id = 'iaijutsu-master';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            trait: 'duelist'
        });

        this.reaction('Change your bid by 1 during a duel')
            .when({
                onHonorDialsRevealed: (_event: EventPayload<EventName.OnHonorDialsRevealed>, context: TriggeredAbilityContext<this>) =>
                    !!context.source.parentCharacter && !!this.game.currentDuel?.isInvolved(context.source.parentCharacter)
            })
            .gameAction(ability.actions.modifyBid({ direction: Direction.Prompt }));
    }
}


export default IaijutsuMaster;
