import DrawCard from '../../DrawCard.js';
import { Phases, EventName } from '../../Constants.js';

class SeizeTheDay extends DrawCard {
    static id = 'seize-the-day';

    setupCardAbilities() {
        this.reaction({
            title: 'Become first player',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && this.game.getFirstPlayer() !== context.player
            },
            handler: () => {
                let firstPlayer = this.game.getFirstPlayer();
                if(!firstPlayer) {
                    return;
                }
                let otherPlayer = this.game.getOtherPlayer(firstPlayer);
                if(otherPlayer) {
                    this.game.raiseEvent(EventName.OnPassFirstPlayer, { player: otherPlayer }, () => this.game.setFirstPlayer(otherPlayer));
                }
            },
            effect: 'become first player!'
        });
    }
}


export default SeizeTheDay;
