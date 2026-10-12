import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { attach, joint } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ExpertBartering extends DrawCard {
    static id = 'expert-bartering';

    setupCardAbilities() {
        // only attachments that can be switched both ways
        const switchAttachments = joint([
            attach((context) => ({
                target: context.source.parentCharacter ?? [],
                attachment: context.target?.isDrawCard() ? context.target : undefined,
                takeControl: context.target?.controller !== context.player
            })),
            attach((context) => ({
                target: context.target?.parentCharacter ?? [],
                attachment: context.source.isDrawCard() ? context.source : undefined,
                giveControl: context.target?.controller !== context.player
            }))
        ]);

        this.action('Switch this attachment with another')
            .cost(costs.payOptionalFate(1, (context) => {
                const contextCopy = context.copy({});
                contextCopy.costs.optionalFatePaid = 0;

                return !context.ability.hasLegalTargets(contextCopy);
            }))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card !== context.source && switchAttachments.hasLegalTarget(context),
                controller: (context) => (context.costs.optionalFatePaid === undefined || context.costs.optionalFatePaid > 0) ? Players.Any : Players.Self
            })
            .gameAction(switchAttachments)
            .chatText((context) => msg`switch ${context.source} with ${context.target}`)
            .cannotTargetFirst();
    }
}


export default ExpertBartering;
