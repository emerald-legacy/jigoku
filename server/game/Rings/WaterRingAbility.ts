import { msg } from '../GameChat.js';
import type { GameRules } from '../GameRules.js';
import { CardType } from '../Constants.js';
import { AbilityContext } from '../AbilityContext.js';
import { BaseAbility } from '../BaseAbility.js';

export class WaterRingAbility extends BaseAbility {
    public title = 'Water Ring Effect';
    public cannotTargetFirst = true;
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

    public executeHandler(context: AbilityContext) {
        if(!context.target) {
            context.game.addMessage(msg`${context.player} chooses not to resolve the ${'water'} ring`);
            this.onResolution(false);
            return;
        }
        if(context.target.bowed) {
            context.game.addMessage(msg`${context.player} resolves the ${'water'} ring, readying ${context.target}`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'water', targetUuid: context.target.uuid, effect: 'ready' });
            context.game.applyGameAction(context, { ready: context.target });
        } else {
            context.game.addMessage(msg`${context.player} resolves the ${'water'} ring, bowing ${context.target}`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'water', targetUuid: context.target.uuid, effect: 'bow' });
            context.game.applyGameAction(context, { bow: context.target });
        }
    }
}
