import DrawCard from '../../DrawCard.js';
import { Element, Players, CardType } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

const elementKey = 'student-of-the-tao-void';

class StudentOfTheTao extends DrawCard {
    static id = 'student-of-the-tao';

    setupCardAbilities() {
        this.action('Move in/out the conflict')
            .condition(context => context.game.currentConflict?.getConflictProvinces().some((a) => a.isElement(this.getCurrentElementSymbol(elementKey))) ?? false)
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character
            }, sendHome());
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Province Element',
            element: Element.Void
        });
        return symbols;
    }
}


export default StudentOfTheTao;
