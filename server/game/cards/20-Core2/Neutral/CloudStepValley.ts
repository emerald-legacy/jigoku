import { CardType, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { joint, moveToConflict, sendHome } from '../../../GameActions/GameActions.js';

const STARTED_IN_CONFLICT = 'started_in';
const STARTED_AT_HOME = 'started_out';

export default class CloudStepValley extends ProvinceCard {
    static id = 'cloud-step-valley';

    setupCardAbilities() {
        this.action('Switch the location of two characters')
            .target({
                name: STARTED_IN_CONFLICT,
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                cardCondition: (card, context) => sendHome().canAffect(card, context)
            })
            .target({
                name: STARTED_AT_HOME,
                dependsOn: STARTED_IN_CONFLICT,
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                player: (context) =>
                    context.targets[STARTED_IN_CONFLICT].controller === context.player
                        ? Players.Self
                        : Players.Opponent,
                cardCondition: (card, context) =>
                    card.controller === context.targets[STARTED_IN_CONFLICT].controller &&
                        moveToConflict().canAffect(card, context)
            })
            .gameAction(joint([
                sendHome(({ targets }) => ({ target: targets[STARTED_IN_CONFLICT] })),
                moveToConflict(({ targets }) => ({ target: targets[STARTED_AT_HOME] }))
            ]))
            .chatText('move {1} home, and move {2} to the conflict', (context) => [context.targets[STARTED_IN_CONFLICT], context.targets[STARTED_AT_HOME]]);
    }
}
