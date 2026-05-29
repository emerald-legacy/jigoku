import type AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';
import DrawCard from '../../DrawCard.js';

class BeastmasterMatriarch extends DrawCard {
    static id = 'beastmaster-matriarch';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.modifyMilitarySkill((card: DrawCard) => this.getTwiceOpponentsClaimedRings(card.controller))
        });
    }

    getTwiceOpponentsClaimedRings(player: Player) {
        if(!player.opponent) {
            return 0;
        }
        return 2 * (player.opponent?.getClaimedRings().length ?? 0);
    }
}


export default BeastmasterMatriarch;
