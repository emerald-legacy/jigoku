import DrawCard from '../../drawcard.js';

class ShadowlandsHunter extends DrawCard {
    static id = 'shadowlands-hunter';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict.winner === context.player,
            effect: ability.effects.forceConflictUnopposed()
        });
    }
}


export default ShadowlandsHunter;


