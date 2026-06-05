import { Duration, EventName } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SevenStingsKeep extends StrongholdCard {
    static id = 'seven-stings-keep';

    setupCardAbilities() {
        this.interrupt({
            title: 'Force defenders to assign first',
            when: {
                onConflictOpportunityAvailable: (event, context) => event.player === context.player
            },
            cost: [AbilityDsl.costs.bowSelf()],
            effect: 'force {1} to declare defenders before attackers are chosen this conflict',
            effectArgs: (context) => [context.player.opponent as Player],
            gameAction: AbilityDsl.actions.menuPrompt((context) => ({
                activePromptTitle: 'Choose how many characters will be attacking',
                choices: this.getChoices(context),
                gameAction: AbilityDsl.actions.playerLastingEffect({
                    duration: Duration.UntilEndOfConflict
                }),
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
                        effect: AbilityDsl.effects.defendersChosenFirstDuringConflict(amount)
                    };
                }
            }))
        });
    }

    getChoices(context: AbilityContext) {
        const min = 1;
        const max = ((context as TriggeredAbilityContext).event as GameEvent<EventName.OnConflictOpportunityAvailable>).attackerMatrix?.maximumNumberOfAttackers ?? 0;
        const array = [];
        for(let i = min; i <= max; i++) {
            array.push(i.toString());
        }
        return array;
    }
}
