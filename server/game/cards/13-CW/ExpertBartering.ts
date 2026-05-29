import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExpertBartering extends DrawCard {
    static id = 'expert-bartering';

    setupCardAbilities() {
        this.action({
            title: 'Switch this attachment with another',
            cost: AbilityDsl.costs.optionalFateCost(1, context => {
                const contextCopy = context.copy({});
                contextCopy.costs.optionalFateCost = 0;

                return !context.ability.hasLegalTargets(contextCopy);
            }),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card !== context.source,
                controller: context => (context.costs.optionalFateCost === undefined || (context.costs.optionalFateCost as number) > 0) ? Players.Any : Players.Self
            },
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.source.parent,
                        attachment: context.target,
                        takeControl: context.target.controller !== context.player
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                })),
                AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.target.parent,
                        attachment: context.source,
                        giveControl: context.target.controller !== context.player
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.source })
                }))
            ]),
            cannotTargetFirst: true,
            effect: 'switch {1} with {2}',
            effectArgs: context => [context.source, (context.target as DrawCard)]
        });
    }
}


export default ExpertBartering;
