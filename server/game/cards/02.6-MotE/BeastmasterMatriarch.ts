import type Player from '../../player.js';
import DrawCard from '../../drawcard.js';

class BeastmasterMatriarch extends DrawCard {
    static id = 'beastmaster-matriarch';

    setupCardAbilities(ability: any) {
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
