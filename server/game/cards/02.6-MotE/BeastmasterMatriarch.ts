import DrawCard from '../../drawcard.js';

class BeastmasterMatriarch extends DrawCard {
    static id = 'beastmaster-matriarch';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyMilitarySkill(card => this.getTwiceOpponentsClaimedRings(card.controller))
        });
    }

    getTwiceOpponentsClaimedRings(player) {
        if(!player.opponent) {
            return 0;
        }
        return 2 * player.opponent.getClaimedRings().length;
    }
}


export default BeastmasterMatriarch;
