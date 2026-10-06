import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import { conditional, moveToConflict, sendHome } from '../../GameActions/GameActions.js';

const elementKey = 'seeker-of-knowledge-air';

class WanderingMediator extends DrawCard {
    static id = 'wandering-mediator';

    setupCardAbilities() {
        this.action('Move in/out the conflict')
            .condition(context => context.game.currentConflict?.getConflictProvinces().some((a) => a.isElement(this.getCurrentElementSymbol(elementKey))) ?? false)
            .gameAction(conditional({
                condition: context => context.source.isDrawCard() && context.source.isParticipating(),
                trueGameAction: sendHome(context => ({
                    target: context.source
                })),
                falseGameAction: moveToConflict(context => ({
                    target: context.source
                }))
            }));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Province Element',
            element: Element.Air
        });
        return symbols;
    }
}


export default WanderingMediator;
