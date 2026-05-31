import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKeys = {
    fire: 'ikoma-reservist-fire',
    water: 'ikoma-reservist-water'
};

class IkomaReservist extends DrawCard {
    static id = 'ikoma-reservist';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                context.game.rings[this.getCurrentElementSymbol(elementKeys.fire)].isConsideredClaimed(context.player) ||
                context.game.rings[this.getCurrentElementSymbol(elementKeys.water)].isConsideredClaimed(context.player)
            ),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.fire,
            prettyName: 'Claimed Ring',
            element: Elements.Fire
        });
        symbols.push({
            key: elementKeys.water,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}


export default IkomaReservist;
