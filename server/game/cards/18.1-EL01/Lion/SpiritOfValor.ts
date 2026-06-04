import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import type { Cost } from '../../../costs/Cost.js';
import DrawCard from '../../../DrawCard.js';

function captureParentCost(): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext) {
            context.costs.captureParentCost = (context.source as DrawCard).parent;
        },
        pay() {}
    };
}

function receiver(context: AbilityContext): DrawCard {
    return (context.costs.captureParentCost ?? (context.source as DrawCard).parent) as DrawCard;
}

export default class SpiritOfValor extends DrawCard {
    static id = 'spirit-of-valor';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (_, player) =>
                    player.cardsInPlay.some(
                        (card) => card.getType() === CardType.Character && card.hasTrait('shugenja')
                    )
                        ? 1
                        : 0,
                match: (card, source) => card === source
            })
        });

        this.action({
            title: 'Gain abilities from a character in your discard pile',
            cost: [captureParentCost(), AbilityDsl.costs.sacrificeSelf()],
            target: {
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
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
