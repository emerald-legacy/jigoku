import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';
import type Player from '../../Player.js';

const elementKeys = {
    air: 'hallowed-ground-air',
    earth: 'hallowed-ground-earth',
    fire: 'hallowed-ground-fire'
};

class HenshinDisciple extends DrawCard {
    static id = 'henshin-disciple';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.hasClaimedOrIsContesting(elementKeys.air, context.player),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: (context) => this.hasClaimedOrIsContesting(elementKeys.earth, context.player),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: (context) => this.hasClaimedOrIsContesting(elementKeys.fire, context.player),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }

    private hasClaimedOrIsContesting(key: string, player: Player) {
        const element = this.getCurrentElementSymbol(key);
        return this.game.rings[element].isConsideredClaimed(player) ||
            !!(this.game.isDuringConflict(element) && this.game.currentConflict?.ring?.isContested());
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.air,
            prettyName: '+2 Political',
            element: Element.Air
        });
        symbols.push({
            key: elementKeys.earth,
            prettyName: '+2 Military',
            element: Element.Earth
        });
        symbols.push({
            key: elementKeys.fire,
            prettyName: 'Pride',
            element: Element.Fire
        });
        return symbols;
    }
}


export default HenshinDisciple;
