import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { playerChoices } from '../playerChoices.js';

class EndlessPlainsSkirmisher extends DrawCard {
    static id = 'endless-plains-skirmisher';

    setupCardAbilities() {
        this.action('Move this character to the conflict')
            .selectFrom({
                targets: true,
                activePromptTitle: 'Which side should this character be on?'
            }, (context) => playerChoices(context.player, (player) => AbilityDsl.actions.moveToConflict({ side: player })))
            .effect('join the conflict for {1}', (context) => context.select === context.player.name ? context.player : context.player.opponent);
    }
}


export default EndlessPlainsSkirmisher;
