import DrawCard from '../../drawcard.js';
import { Phases, EventNames } from '../../Constants.js';

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
                let otherPlayer = this.game.getOtherPlayer(firstPlayer);
                if(otherPlayer) {
                    this.game.raiseEvent(EventNames.OnPassFirstPlayer, { player: otherPlayer }, () => this.game.setFirstPlayer(otherPlayer));
                }
            },
            effect: 'become first player!'
        });
    }
}


export default SeizeTheDay;
