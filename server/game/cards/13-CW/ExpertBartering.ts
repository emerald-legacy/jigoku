import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { attach, discardFromPlay, ifAble, joint } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ExpertBartering extends DrawCard {
    static id = 'expert-bartering';

    setupCardAbilities() {
        this.action('Switch this attachment with another')
            .cost(AbilityDsl.costs.optionalFateCost(1, context => {
                const contextCopy = context.copy({});
                contextCopy.costs.optionalFateCost = 0;

                return !context.ability.hasLegalTargets(contextCopy);
            }))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card !== context.source,
                controller: context => (context.costs.optionalFateCost === undefined || context.costs.optionalFateCost > 0) ? Players.Any : Players.Self
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
            .effect((context) => msg`switch ${context.source} with ${context.target}`)
            .cannotTargetFirst();
    }
}


export default ExpertBartering;
