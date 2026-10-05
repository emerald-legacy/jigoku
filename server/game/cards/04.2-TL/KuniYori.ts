import DrawCard from '../../DrawCard.js';
import { CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { playerChoices } from '../playerChoices.js';

const elementKey = 'kuni-yori-earth';

class KuniYori extends DrawCard {
    static id = 'kuni-yori';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            match: card => card.getType() === CardType.Character,
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.action('Select a player to discard a card at random')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(() => this.game.isDuringConflict())
            .selectFrom({
                activePromptTitle: 'Select a player to discard a random card from his/her hand',
                targets: true
            }, (context) => playerChoices(context.player, (player) => AbilityDsl.actions.discardAtRandom({ target: player })));
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
