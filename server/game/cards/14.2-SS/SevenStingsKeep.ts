import { EventName } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { defendersChosenFirstDuringConflict } from '../../effects.js';
import { menuPrompt, playerLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class SevenStingsKeep extends StrongholdCard {
    static id = 'seven-stings-keep';

    setupCardAbilities() {
        this.interrupt('Force defenders to assign first')
            .when({
                onConflictOpportunityAvailable: (event, context) => event.player === context.player
            })
            .cost(costs.bowSelf())
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
            .chatText((context) => msg`force ${context.player.opponent} to declare defenders before attackers are chosen this conflict`);
    }

    private getChoices(event: GameEvent<EventName.OnConflictOpportunityAvailable>) {
        const max = event.attackerMatrix?.maximumNumberOfAttackers ?? 0;
        return Array.from({ length: max }, (_, i) => (i + 1).toString());
    }
}
