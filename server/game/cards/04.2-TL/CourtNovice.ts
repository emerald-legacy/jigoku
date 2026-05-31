import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKeys = {
    air: 'court-novice-air',
    water: 'court-novice-water'
};

class CourtNovice extends DrawCard {
    static id = 'court-novice';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                context.game.rings[this.getCurrentElementSymbol(elementKeys.air)].isConsideredClaimed(context.player) ||
                context.game.rings[this.getCurrentElementSymbol(elementKeys.water)].isConsideredClaimed(context.player)
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
            key: elementKeys.water,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}


export default CourtNovice;
