import AbilityDsl from '../../../abilitydsl.js';
import { Duration, EventName } from '../../../Constants.js';
import type { GameEvent } from '../../../Events/EventPayloads.js';
import DrawCard from '../../../DrawCard.js';

export default class UnderTheNewMoon extends DrawCard {
    static id = 'under-the-new-moon';

    setupCardAbilities() {
        this.interrupt('Force defenders to assign first')
            .when({
                onConflictOpportunityAvailable: (event, context) => event.player === context.player
            })
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(AbilityDsl.actions.menuPrompt((context) => ({
                activePromptTitle: 'Choose how many characters will be attacking',
                choices: this.getChoices(context.event),
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
            })))
            .effect('force {1} to declare defenders before attackers are chosen this conflict', (context) => [context.player.opponent]);
    }

    private getChoices(event: GameEvent<EventName.OnConflictOpportunityAvailable>) {
        const min = 1;
        const max = event.attackerMatrix?.maximumNumberOfAttackers ?? 0;
        const array = [];
        for(let i = min; i <= max; i++) {
            array.push(i.toString());
        }
        return array;
    }
}
