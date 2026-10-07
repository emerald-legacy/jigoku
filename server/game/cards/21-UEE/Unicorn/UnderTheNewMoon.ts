import * as costs from '../../../costs/index.js';
import { defendersChosenFirstDuringConflict } from '../../../effects.js';
import { menuPrompt, playerLastingEffect } from '../../../GameActions/GameActions.js';
import { EventName } from '../../../Constants.js';
import type { GameEvent } from '../../../Events/EventPayloads.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class UnderTheNewMoon extends DrawCard {
    static id = 'under-the-new-moon';

    setupCardAbilities() {
        this.interrupt('Force defenders to assign first')
            .when({
                onConflictOpportunityAvailable: (event, context) => event.player === context.player
            })
            .cost(costs.payHonor(1))
            .gameAction(menuPrompt((context) => ({
                activePromptTitle: 'Choose how many characters will be attacking',
                choices: this.getChoices(context.event),
                gameAction: playerLastingEffect({}),
                choiceHandler: (choice, displayMessage) => {
                    const amount = parseInt(choice);
                    if(displayMessage) {
                        this.game.addMessage(
                            '{0} will attack with {1} character{2}',
                            context.player,
                            choice,
                            choice === '1' ? '' : 's'
                        );
                    }
                    return {
                        effect: defendersChosenFirstDuringConflict(amount)
                    };
                }
            })))
            .effect((context) => msg`force ${context.player.opponent} to declare defenders before attackers are chosen this conflict`);
    }

    private getChoices(event: GameEvent<EventName.OnConflictOpportunityAvailable>) {
        const min = 1;
        const max = event.attackerMatrix.maximumNumberOfAttackers;
        const array = [];
        for(let i = min; i <= max; i++) {
            array.push(i.toString());
        }
        return array;
    }
}
