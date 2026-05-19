import DrawCard from '../../drawcard.js';
import { Elements } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'seeker-of-knowledge-air';

class WanderingMediator extends DrawCard {
    static id = 'wandering-mediator';

    setupCardAbilities() {
        this.action({
            title: 'Move in/out the conflict',
            condition: context => context.game.isDuringConflict() && context.game.currentConflict.getConflictProvinces().some(a => a.isElement(this.getCurrentElementSymbol(elementKey))),
            gameAction: AbilityDsl.actions.conditional({
                condition: context => context.source.isParticipating(),
                trueGameAction: AbilityDsl.actions.sendHome(context => ({
                    target: context.source
                })),
                falseGameAction: AbilityDsl.actions.moveToConflict(context => ({
                    target: context.source
                }))
            })
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Province Element',
            element: Elements.Air
        });
        return symbols;
    }
}


export default WanderingMediator;
