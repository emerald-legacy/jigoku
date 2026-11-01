import DrawCard from '../../DrawCard.js';
import { addKeyword, modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import { Element } from '../../Constants.js';
import type Player from '../../Player.js';
import { hasClaimedRing } from '../claimedRings.js';

const elementKeys = {
    air: 'henshin-disciple-air',
    earth: 'henshin-disciple-earth',
    fire: 'henshin-disciple-fire'
};

class HenshinDisciple extends DrawCard {
    static id = 'henshin-disciple';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.hasClaimedOrIsContesting(elementKeys.air, context.player),
            effect: modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: (context) => this.hasClaimedOrIsContesting(elementKeys.earth, context.player),
            effect: modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: (context) => this.hasClaimedOrIsContesting(elementKeys.fire, context.player),
            effect: addKeyword('pride')
        });
    }

    private hasClaimedOrIsContesting(key: string, player: Player) {
        const element = this.getCurrentElementSymbol(key);
        return hasClaimedRing(this, key, player) ||
            !!(this.game.isDuringConflict(element) && this.game.currentConflict?.ring?.isContested());
    }

    protected override printedElementSymbols = [
        {
            key: elementKeys.air,
            prettyName: '+2 Political',
            element: Element.Air
        },
        {
            key: elementKeys.earth,
            prettyName: '+2 Military',
            element: Element.Earth
        },
        {
            key: elementKeys.fire,
            prettyName: 'Pride',
            element: Element.Fire
        }
    ];
}


export default HenshinDisciple;
