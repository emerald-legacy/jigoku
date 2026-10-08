import DrawCard from '../../DrawCard.js';
import { CardType, Element } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyBothSkills } from '../../effects.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';
import { playerChoices } from '../playerChoices.js';

const elementKey = 'kuni-yori-earth';

class KuniYori extends DrawCard {
    static id = 'kuni-yori';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            match: (card) => card.getType() === CardType.Character,
            effect: modifyBothSkills(1)
        });

        this.action('Select a player to discard a card at random')
            .cost(costs.payHonor(1))
            .condition(() => this.game.isDuringConflict())
            .selectFrom({
                activePromptTitle: 'Select a player to discard a random card from his/her hand',
                targets: true
            }, (context) => playerChoices(context.player, (player) => discardAtRandom({ target: player })));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Earth
        });
        return symbols;
    }
}


export default KuniYori;
