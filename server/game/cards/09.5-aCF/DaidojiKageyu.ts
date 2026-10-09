import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
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
            .draw((context) => ({ amount: cardsPlayed(context.player.opponent) }))
            .chatText((context) => msg`draw ${cardsPlayed(context.player.opponent)} card${cardsPlayed(context.player.opponent) > 1 ? 's' : ''}`);
    }
}


export default DaidojiKageyu;
