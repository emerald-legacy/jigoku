import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { gainPrintedAbilities, reduceCost } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { captureParentCost, capturedParent } from '../../captureParentCost.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import DrawCard from '../../../DrawCard.js';

export default class SpiritOfValor extends DrawCard {
    static id = 'spirit-of-valor';

    public override setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_, player) => controlsShugenja(player) ? 1 : 0,
                match: (card, source) => card === source
            })
        });

        this.action('Gain abilities from a character in your discard pile')
            .condition((context) => context.game.isDuringConflict())
            .cost(captureParentCost())
            .cost(costs.sacrificeSelf())
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                cardType: CardType.Character,
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isFaction('lion')
            }, cardLastingEffect((context) => ({
                target: capturedParent(context) ?? [],
                effect: context.target ? gainPrintedAbilities(context.target) : []
            })))
            .chatText((context) => msg`copy ${context.chatTarget()}'s abilities onto ${capturedParent(context)}`);
    }
}
