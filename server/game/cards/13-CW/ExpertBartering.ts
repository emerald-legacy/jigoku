import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ExpertBartering extends DrawCard {
    static id = 'expert-bartering';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Switch this attachment with another',
            cost: AbilityDsl.costs.optionalFateCost(1, context => {
                const contextCopy = context.copy({});
                contextCopy.costs.optionalFateCost = 0;

                return !context.ability.hasLegalTargets(contextCopy);
            }),
            target: {
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card !== context.source,
                controller: context => (context.costs.optionalFateCost === undefined || (context.costs.optionalFateCost as number) > 0) ? Players.Any : Players.Self
            },
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.ifAble((context: AbilityContext<DrawCard, DrawCard>) => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.source.parentCharacter,
                        attachment: context.target,
                        takeControl: context.target?.controller !== context.player
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                })),
                AbilityDsl.actions.ifAble((context: AbilityContext<DrawCard, DrawCard>) => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.target?.parentCharacter ?? undefined,
                        attachment: context.source,
                        giveControl: context.target?.controller !== context.player
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.source })
                }))
            ]),
            cannotTargetFirst: true,
            effect: 'switch {1} with {2}',
            effectArgs: context => [context.source, context.target ?? '']
        });
    }
}


export default ExpertBartering;
