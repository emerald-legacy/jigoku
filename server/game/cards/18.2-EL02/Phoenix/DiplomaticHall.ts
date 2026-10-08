import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { draw } from '../../../GameActions/GameActions.js';
import { ConflictType } from '../../../Constants.js';
import { playerChoices } from '../../playerChoices.js';

class DiplomaticHall extends DrawCard {
    static id = 'diplomatic-hall';

    setupCardAbilities() {
        this.conflictAction('Select a player to draw a card', { conflictType: ConflictType.Political })
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => draw({ target: player })))
            .chatText((context) => msg`have ${(context.select === context.player.name ? context.player : context.player.opponent)} draw a card`);
    }
}


export default DiplomaticHall;
