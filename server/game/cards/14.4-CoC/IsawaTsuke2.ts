import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes, CardTypes, Elements } from '../../Constants.js';

const elementKey = 'isawa-tsuke-2-fire';

class IsawaTsuke2 extends DrawCard {
    static id = 'isawa-tsuke-2';

    setupCardAbilities() {
        this.action({
            title: 'Lose honor to discard fate',
            effect: 'lose {1} honor to discard a fate from {2}',
            effectArgs: (context) => [context.costs.variableHonorCost, context.target],
            condition: (context) =>
                context.game.isDuringConflict() &&
                context.game.rings[this.getCurrentElementSymbol(elementKey)].isUnclaimed(),
            cost: AbilityDsl.costs.variableHonorCost((context) => this.getNumberOfLegalTargets(context)),
            target: {
                mode: TargetModes.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.variableHonorCost) {
                        return context.costs.variableHonorCost;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                // @ts-expect-error context.targets/selects values are dynamically typed, flat() returns unknown[] but game engine handles it
                gameAction: AbilityDsl.actions.removeFate((context) => {
                    let targets = Object.values(context.targets).flat();
                    targets = targets.concat(Object.values(context.selects).flat());

                    return { target: targets };
                })
            },
            cannotTargetFirst: true
        });
    }

    getNumberOfLegalTargets(context: any) {
        const cards = context.game.currentConflict.getParticipants((card: any) => card.allowGameAction('removeFate'));
        const selectedCards: any[] = [];
        cards.forEach((card: any) => {
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
            element: Elements.Fire
        });
        return symbols;
    }
}


export default IsawaTsuke2;
