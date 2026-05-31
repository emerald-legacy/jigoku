import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKeys = {
    air: 'sadane-student-air',
    fire: 'sadane-student-fire'
} as Record<string, string>;

class SadaneStudent extends DrawCard {
    static id = 'sadane-student';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                context.game.rings[this.getCurrentElementSymbol(elementKeys.air)].isConsideredClaimed(context.player) ||
                context.game.rings[this.getCurrentElementSymbol(elementKeys.fire)].isConsideredClaimed(context.player)
            ),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.air,
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        symbols.push({
            key: elementKeys.fire,
            prettyName: 'Claimed Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}


export default SadaneStudent;
