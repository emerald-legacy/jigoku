import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { ConflictType } from '../../../Constants.js';
import { playerChoices } from '../../playerChoices.js';

class DiplomaticHall extends DrawCard {
    static id = 'diplomatic-hall';

    setupCardAbilities() {
        this.action('Select a player to draw a card')
            .condition(context => context.game.isDuringConflict(ConflictType.Political))
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => AbilityDsl.actions.draw({ target: player })))
            .effect('have {1} draw a card', context => (context.select === context.player.name ? context.player : context.player.opponent));
    }
}


export default DiplomaticHall;
