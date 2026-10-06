import DrawCard from '../../DrawCard.js';
import { draw } from '../../GameActions/GameActions.js';
import type Player from '../../Player.js';
import { ConflictType } from '../../Constants.js';

class DaidojiKageyu extends DrawCard {
    static id = 'daidoji-kageyu';

    setupCardAbilities() {
        const cardsPlayed = (opponent: Player | undefined): number => {
            const conflict = this.game.currentConflict;
            if(!conflict || !opponent) {
                return 0;
            }
            return conflict.getNumberOfCardsPlayed(opponent);
        };

        this.action('Draw cards')
            .condition((context) => this.game.isDuringConflict(ConflictType.Political) &&
                context.source.isParticipating() &&
                cardsPlayed(context.player.opponent) > 0)
            .gameAction(draw((context) => ({ amount: cardsPlayed(context.player.opponent) })))
            .effect('draw {1} card{2}', (context) => [
                cardsPlayed(context.player.opponent),
                cardsPlayed(context.player.opponent) > 1 ? 's' : ''
            ]);
    }
}


export default DaidojiKageyu;
