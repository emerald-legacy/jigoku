import AbilityDsl from '../../../abilitydsl.js';
import { gainAllAbilities, reduceCost } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { Location, Players } from '../../../Constants.js';
import { captureParentCost, capturedParent } from '../../captureParentCost.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import DrawCard from '../../../DrawCard.js';

export default class SpiritOfValor extends DrawCard {
    static id = 'spirit-of-valor';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_, player) => controlsShugenja(player) ? 1 : 0,
                match: (card, source) => card === source
            })
        });

        this.action('Gain abilities from a character in your discard pile')
            .cost(captureParentCost())
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isFaction('lion')
            }, cardLastingEffect((context) => ({
                target: capturedParent(context) ?? [],
                effect: context.target ? gainAllAbilities(context.target) : []
            })))
            .effect('copy {0}\'s abilities onto {1}', (context) => [capturedParent(context)]);
    }
}
