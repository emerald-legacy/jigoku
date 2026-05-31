import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKey = 'stride-the-waves-water';

class StrideTheWaves extends DrawCard {
    static id = 'stride-the-waves';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Move attached character in or out of the conflict',
            limit: AbilityDsl.limit.perRound(2),
            condition: context => context.game.isDuringConflict() &&
                context.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player),
            gameAction: AbilityDsl.actions.conditional({
                condition: context => context.source.parent && context.source.parent.inConflict,
                trueGameAction: AbilityDsl.actions.sendHome(context => ({
                    target: context.source.parent
                })),
                falseGameAction: AbilityDsl.actions.moveToConflict(context => ({
                    target: context.source.parent
                }))
            }),
            effect: '{3} {1} {2}',
            effectArgs: context => {
                const parent = context.source.parent;
                return [
                    parent ?? '',
                    parent && parent.inConflict ? 'home' : 'into the conflict',
                    parent && parent.inConflict ? 'send' : 'move'
                ];
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}


export default StrideTheWaves;
