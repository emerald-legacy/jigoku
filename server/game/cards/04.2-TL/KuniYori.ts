import DrawCard from '../../DrawCard.js';
import { CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

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
            .select('target', {
                activePromptTitle: 'Select a player to discard a random card from his/her hand',
                targets: true
            }, {
                [this.owner.name]: AbilityDsl.actions.discardAtRandom({ target: this.owner }),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.discardAtRandom({ target: this.owner.opponent })
            });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Earth
        });
        return symbols;
    }
}


export default KuniYori;
