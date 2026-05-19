import DrawCard from '../../drawcard.js';

class TirelessSodanSenzo extends DrawCard {
    static id = 'tireless-sodan-senzo';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating() && this.game.currentConflict.loser === context.player,
            effect: ability.effects.doesNotBow()
        });
    }
}


export default TirelessSodanSenzo;
