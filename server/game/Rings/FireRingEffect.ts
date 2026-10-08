import { msg } from '../GameChat.js';
import { AbilityContext } from '../AbilityContext.js';
import { CardType, Element } from '../Constants.js';
import { BaseAbility } from '../BaseAbility.js';
import type { HandlerMenuOption } from '../gamesteps/HandlerMenuPrompt.js';
import DrawCard from '../DrawCard.js';

export class FireRingEffect extends BaseAbility {
    public title = 'Fire Ring Effect';
    public cannotTargetFirst = true;
    public defaultPriority = 4; // Default resolution priority when players have ordering switched off

    constructor(
        private optional: boolean,
        private onResolution = (_resolved: boolean) => {}
    ) {
        super({
            target: {
                activePromptTitle: 'Choose character to honor or dishonor',
                cardType: CardType.Character,
                cardCondition: <C extends DrawCard>(card: C, context: AbilityContext) =>
                    card.allowGameAction('honor', context) || card.allowGameAction('dishonor', context),
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : []
            }
        });
    }

    public executeHandler(context: AbilityContext) {
        const target = context.target;
        if(!target) {
            context.game.addMessage(msg`${context.player} chooses not to resolve the ${'fire'} ring`);
            this.onResolution(false);
            return;
        }

        const options: HandlerMenuOption[] = [];

        if(target.allowGameAction('honor', context)) {
            options.push({
                text: `Honor ${target.name}`,
                handler: () => {
                    context.game.addMessage(msg`${context.player} resolves the ${'fire'} ring, honoring ${target}`);
                    this.onResolution(true);
                    context.game.addAnimation({ type: 'fire', targetUuid: target.uuid, effect: 'honor' });
                    context.game.applyGameAction(context, { honor: target });
                }
            });
        }

        if(target.allowGameAction('dishonor', context)) {
            options.push({
                text: `Dishonor ${target.name}`,
                handler: () => {
                    context.game.addMessage(msg`${context.player} resolves the ${'fire'} ring, dishonoring ${target}`);
                    this.onResolution(true);
                    context.game.addAnimation({ type: 'fire', targetUuid: target.uuid, effect: 'dishonor' });
                    context.game.applyGameAction(context, { dishonor: target });
                }
            });
        }

        options.push({ text: 'Back', handler: () => context.player.resolveRingEffects([Element.Fire], this.optional) });

        if(this.optional) {
            options.push({
                text: 'Don\'t resolve the fire ring',
                handler: () => {
                    context.game.addMessage(msg`${context.player} chooses not to resolve the ${'fire'} ring`);
                    this.onResolution(false);
                }
            });
        }

        context.game.promptWithHandlerMenu(context.player, {
            options,
            source: 'Fire Ring'
        });
    }
}
