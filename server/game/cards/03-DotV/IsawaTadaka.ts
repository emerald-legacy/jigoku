import DrawCard from '../../DrawCard.js';
import { Players, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'isawa-tadaka-earth';

class IsawaTadaka extends DrawCard {
    static id = 'isawa-tadaka';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => !context.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player.opponent),
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'play',
                restricts: 'copiesOfDiscardEvents'
            })
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Element.Earth
        });
        return symbols;
    }
}


export default IsawaTadaka;
