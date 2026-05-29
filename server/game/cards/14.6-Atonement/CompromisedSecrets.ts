import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityContext } from '../../AbilityContext.js';

const compromisedSecretsCost = function (secretsController: any) {
    return {
        canPay: function (context: AbilityContext) {
            const canLoseHonor = context.game.actions.loseHonor().canAffect(context.player, context);
            const canGainHonor = context.game.actions.gainHonor().canAffect(secretsController, context);
            //The controller of the character must give the controller of Compromised Secrets 1 honor
            //You cannot force the controller to pay if you are not the controller, and the controller cannot pay themselves
            return canLoseHonor && canGainHonor && context.player === context.source.controller && context.player !== secretsController;
        },
        resolve: function () {
            return true;
        },
        payEvent: function (context: AbilityContext) {
            const events = [];
            const honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
            events.push(honorAction.getEvent(context.player, context));
            context.game.addMessage('{0} gives {1} 1 honor to trigger {2}\'s ability', context.player, secretsController, context.source);

            return events;
        },
        promptsPlayer: false
    };
};

class CompromisedSecrets extends DrawCard {
    static id = 'compromised-secrets';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.additionalTriggerCostForCard(() => [compromisedSecretsCost(this.controller)])
        });
    }

    canPlay(context: AbilityContext, playType: string = 'play'): boolean {
        return !!(context.player.opponent && context.player.isLessHonorable()) && super.canPlay(context, playType);
    }
}


export default CompromisedSecrets;
