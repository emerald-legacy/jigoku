import { msg } from '../GameChat.js';
import type { GameRules } from '../GameRules.js';
import { CardType, Element } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import { BaseAbility } from '../BaseAbility.js';
import { bow, ready } from '../GameActions/GameActions.js';

export class WaterRingAbility extends BaseAbility {
    public override title = 'Water Ring Effect';
    public override cannotTargetFirst = true;
    public defaultPriority = 3; // Default resolution priority when players have ordering switched off

    constructor(
        optional: boolean,
        rules: GameRules,
        private onResolution = (_resolved: boolean) => {}
    ) {
        super({
            target: {
                activePromptTitle: 'Choose character to bow or unbow',
                source: 'Water Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: CardType.Character,
                cardCondition: rules.ringWaterTargetCondition
            }
        });
    }

    public override executeHandler(context: AbilityContext) {
        if(!context.target) {
            context.game.addMessage(msg`${context.player} chooses not to resolve the ${Element.Water} ring`);
            this.onResolution(false);
            return;
        }
        if(context.target.bowed) {
            context.game.addMessage(msg`${context.player} resolves the ${Element.Water} ring, readying ${context.target}`);
            this.onResolution(true);
            context.game.addAnimation({ type: Element.Water, targetUuid: context.target.uuid, effect: 'ready' });
            context.game.resolveActions([ready({ target: context.target })], context);
        } else {
            context.game.addMessage(msg`${context.player} resolves the ${Element.Water} ring, bowing ${context.target}`);
            this.onResolution(true);
            context.game.addAnimation({ type: Element.Water, targetUuid: context.target.uuid, effect: 'bow' });
            context.game.resolveActions([bow({ target: context.target })], context);
        }
    }
}
