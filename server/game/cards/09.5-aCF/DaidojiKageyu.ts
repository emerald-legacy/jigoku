import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiKageyu extends DrawCard {
    static id = 'daidoji-kageyu';

    setupCardAbilities() {
        const cardsPlayed = (opponent: any): number => {
            const conflict = this.game.currentConflict;
            if(!conflict || !opponent) {
                return 0;
            }
            return conflict.getNumberOfCardsPlayed(opponent);
        };

        this.action({
            title: 'Draw cards',
            condition: (context) => this.game.isDuringConflict('political') &&
                context.source.isParticipating() &&
                cardsPlayed(context.player.opponent) > 0,
            gameAction: AbilityDsl.actions.draw((context) => ({ amount: cardsPlayed(context.player.opponent) })),
            effect: 'draw {1} card{2}',
            effectArgs: (context) => [
                cardsPlayed(context.player.opponent),
                cardsPlayed(context.player.opponent) > 1 ? 's' : ''
            ]
        });
    }
}


export default DaidojiKageyu;
