import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import * as costs from '../../costs/index.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { TargetMode, CardType, Element } from '../../Constants.js';
import { countTargetable } from '../countTargetable.js';
import { msg } from '../../GameChat.js';

const elementKey = 'isawa-tsuke-2-fire';

class IsawaTsuke2 extends DrawCard {
    static id = 'isawa-tsuke-2';

    setupCardAbilities() {
        this.action('Lose honor to discard fate')
            .cost(costs.payVariableHonor((context) => this.getNumberOfLegalTargets(context)))
            .condition((context) =>
                context.game.isDuringConflict() &&
                context.game.rings[this.getCurrentElementSymbol(elementKey)].isUnclaimed())
            .targetCards({
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context.costs.honorPaid) {
                        return context.costs.honorPaid;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, removeFate((context) => {
                return { target: Object.values(context.targets).flat() };
            }))
            .effect((context) => msg`lose ${context.costs.honorPaid} honor to discard a fate from ${context.targets.target}`)
            .cannotTargetFirst();
    }

    private getNumberOfLegalTargets(context: AbilityContext) {
        return countTargetable(context.game.requireConflict().getParticipants((card) => card.allowGameAction('removeFate')), context);
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Unclaimed Ring',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IsawaTsuke2;
