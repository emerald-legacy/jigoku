import type { Cost } from '../costs/Cost.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';

/** An additional cost to trigger a character's ability: its controller gives `recipient` 1 honor. */
export function giveHonorToTriggerCost(recipient: Player): Cost {
    return {
        canPay(context) {
            const canLoseHonor = context.game.actions.loseHonor().canAffect(context.player, context);
            const canGainHonor = context.game.actions.gainHonor().canAffect(recipient, context);
            //The controller of the character must give the recipient 1 honor
            //You cannot force the controller to pay if you are not the controller, and the controller cannot pay themselves
            return canLoseHonor && canGainHonor && context.player === context.source.controller && context.player !== recipient;
        },
        resolve() {
            return true;
        },
        payEvent(context) {
            const events: Event[] = [];
            const honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
            events.push(honorAction.getEvent(context.player, context));
            context.game.addMessage('{0} gives {1} 1 honor to trigger {2}\'s ability', context.player, recipient, context.source);

            return events;
        },
        promptsPlayer: false
    };
}
