import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { attach, discardFromPlay, ifAble, joint } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ExpertBartering extends DrawCard {
    static id = 'expert-bartering';

    setupCardAbilities() {
        this.action('Switch this attachment with another')
            .cost(costs.payOptionalFate(1, (context) => {
                const contextCopy = context.copy({});
                contextCopy.costs.optionalFatePaid = 0;

                return !context.ability.hasLegalTargets(contextCopy);
            }))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card !== context.source,
                controller: (context) => (context.costs.optionalFatePaid === undefined || context.costs.optionalFatePaid > 0) ? Players.Any : Players.Self
            })
            .gameAction(joint([
                ifAble((context) => ({
                    ifAbleAction: attach({
                        target: context.source.parentCharacter ?? [],
                        attachment: context.target,
                        takeControl: context.target?.controller !== context.player
                    }),
                    otherwiseAction: discardFromPlay({ target: context.target })
                })),
                ifAble((context) => ({
                    ifAbleAction: attach({
                        target: context.target?.parentCharacter ?? undefined,
                        attachment: context.source,
                        giveControl: context.target?.controller !== context.player
                    }),
                    otherwiseAction: discardFromPlay({ target: context.source })
                }))
            ]))
            .chatText((context) => msg`switch ${context.source} with ${context.target}`)
            .cannotTargetFirst();
    }
}


export default ExpertBartering;
