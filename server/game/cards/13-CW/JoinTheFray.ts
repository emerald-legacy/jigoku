import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';
import { putIntoConflict } from '../../GameActions/GameActions.js';
import { playerChoices } from '../playerChoices.js';

class JoinTheFray extends DrawCard {
    static id = 'join-the-fray';

    setupCardAbilities() {
        this.conflictAction('Put a character into play from a province', { conflictType: ConflictType.Military })
            .target({
                name: 'character',
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('cavalry')
            })
            .selectFrom({
                name: 'select',
                dependsOn: 'character',
                targets: true,
                activePromptTitle: 'Which side should this character be on?'
            }, (context) => playerChoices(context.player, (player) => putIntoConflict({ side: player, target: context.targets.character })))
            .chatText((context) => msg`have ${context.targets.character} join the conflict for ${context.selects.select.choice === context.player.name ? context.player : context.player.opponent}`);
    }
}


export default JoinTheFray;
