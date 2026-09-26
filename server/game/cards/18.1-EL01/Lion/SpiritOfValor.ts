import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import type { Cost } from '../../../costs/Cost.js';
import DrawCard from '../../../DrawCard.js';

function captureParentCost(): Cost<{ captureParentCost: DrawCard | null }> {
    return {
        canPay() {
            return true;
        },
        resolve(context) {
            context.costs.captureParentCost = context.source.parentCharacter;
        },
        pay() {}
    };
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

        this.action('Gain abilities from a character in your discard pile')
            .cost(captureParentCost())
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target('target', {
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isFaction('lion')
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.costs.captureParentCost ?? context.source.parentCharacter ?? [],
                effect: context.target ? AbilityDsl.effects.gainAllAbilities(context.target) : []
            })))
            .effect('copy {0}\'s abilities onto {1}', (context) => [context.costs.captureParentCost ?? context.source.parentCharacter]);
    }
}
