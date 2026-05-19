import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiKageyu extends DrawCard {
    static id = 'daidoji-kageyu';

    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            condition: context => this.game.isDuringConflict('political') &&
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent) > 0,
            gameAction: AbilityDsl.actions.draw(context => ({ amount: this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent) })),
            effect: 'draw {1} card{2}',
            effectArgs: context => [
                this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent),
                this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent) > 1 ? 's' : ''
            ]
        });
    }
}


export default DaidojiKageyu;
