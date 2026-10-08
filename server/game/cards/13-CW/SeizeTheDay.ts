import DrawCard from '../../DrawCard.js';
import { Phase, EventName } from '../../Constants.js';

class SeizeTheDay extends DrawCard {
    static id = 'seize-the-day';

    setupCardAbilities() {
        this.reaction('Become first player')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Conflict && this.game.getFirstPlayer() !== context.player
            })
            .handler(() => {
                const firstPlayer = this.game.getFirstPlayer();
                if(!firstPlayer) {
                    return;
                }
                const otherPlayer = firstPlayer.opponent;
                if(otherPlayer) {
                    this.game.raiseEvent(EventName.OnPassFirstPlayer, { player: otherPlayer }, () => this.game.setFirstPlayer(otherPlayer));
                }
            })
            .chatText('become first player');
    }
}


export default SeizeTheDay;
