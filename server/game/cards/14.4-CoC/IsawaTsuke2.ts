import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, CardType, Element } from '../../Constants.js';

const elementKey = 'isawa-tsuke-2-fire';

class IsawaTsuke2 extends DrawCard {
    static id = 'isawa-tsuke-2';

    setupCardAbilities() {
        this.action('Lose honor to discard fate')
            .cost(AbilityDsl.costs.variableHonorCost((context) => this.getNumberOfLegalTargets(context)))
            .condition((context) =>
                context.game.isDuringConflict() &&
                context.game.rings[this.getCurrentElementSymbol(elementKey)].isUnclaimed())
            .targetCards('target', {
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.variableHonorCost) {
                        return context.costs.variableHonorCost;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.removeFate((context) => {
                return { target: Object.values(context.targets).flat() };
            }))
            .effect('lose {1} honor to discard a fate from {2}', (context) => [context.costs.variableHonorCost, context.targets.target])
            .cannotTargetFirst();
    }

    getNumberOfLegalTargets(context: AbilityContext) {
        const cards = context.game.requireConflict().getParticipants((card) => card.allowGameAction('removeFate'));
        const selectedCards: DrawCard[] = [];
        cards.forEach((card) => {
            if(card.canBeTargeted(context, selectedCards)) {
                selectedCards.push(card);
            }
        });

        return selectedCards.length;
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Unclaimed Ring',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IsawaTsuke2;
