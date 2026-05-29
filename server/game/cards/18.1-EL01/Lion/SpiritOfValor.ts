import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations, Players } from '../../../Constants.js';
import type { Cost } from '../../../Costs.js';
import DrawCard from '../../../DrawCard.js';

function captureParentCost(): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext) {
            context.costs.captureParentCost = context.source.parent;
        },
        pay() {}
    };
}

function receiver(context: AbilityContext): DrawCard {
    return context.costs.captureParentCost ?? context.source.parent;
}

export default class SpiritOfValor extends DrawCard {
    static id = 'spirit-of-valor';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (_: any, player: any) =>
                    player.cardsInPlay.some(
                        (card: any) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
                    )
                        ? 1
                        : 0,
                match: (card: any, source: any) => card === source
            })
        });

        this.action({
            title: 'Gain abilities from a character in your discard pile',
            cost: [captureParentCost(), AbilityDsl.costs.sacrificeSelf()],
            target: {
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isFaction('lion'),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: receiver(context),
                    effect: AbilityDsl.effects.gainAllAbilities(context.target)
                }))
            },
            effect: 'copy {0}\'s abilities onto {1}',
            effectArgs: (context) => [receiver(context)]
        });
    }
}
