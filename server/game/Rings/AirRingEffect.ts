import { TargetMode } from '../Constants.js';
import { CalculateHonorLimit } from '../GameActions/Shared/HonorLogic.js';
import { AbilityContext } from '../AbilityContext.js';
import { BaseAbility } from '../BaseAbility.js';
import { AIR_CHOICE, type GameRules } from '../GameRules.js';

export class AirRingEffect extends BaseAbility {
    public title = 'Air Ring Effect';
    public cannotTargetFirst = true;
    public defaultPriority = 5; // Default resolution priority when players have ordering switched off

    public constructor(
        optional: boolean,
        rules: GameRules,
        private onResolution = (_resolved: boolean) => {}
    ) {
        super({
            target: {
                mode: TargetMode.Select,
                activePromptTitle: 'Choose an effect to resolve',
                source: 'Air Ring',
                choices: rules.ringAirChoices(optional)
            }
        });
    }

    public executeHandler(context: AbilityContext): void {
        if(context.select === AIR_CHOICE.GAIN_2) {
            const [, amountToTransfer] = CalculateHonorLimit(
                context.player,
                context.game.roundNumber,
                context.game.currentPhase,
                2
            );
            context.game.addMessage(
                '{0} resolves the {1} ring, gaining {2} honor',
                context.player,
                'air',
                amountToTransfer
            );
            this.onResolution(true);
            context.game.addAnimation({ type: 'air', playerName: context.player.name, effect: 'gain-honor' });
            return context.game.actions.gainHonor({ amount: 2 }).resolve(context.player, context);
        }
        if(context.select === AIR_CHOICE.TAKE_1) {
            context.game.addMessage(
                '{0} resolves the {1} ring, taking 1 honor from {2}',
                context.player,
                'air',
                context.player.opponent
            );
            this.onResolution(true);
            context.game.addAnimation({ type: 'air', playerName: context.player.name, effect: 'take-honor' });
            return context.game.actions.takeHonor().resolve(context.player.opponent, context);
        }
        if(!context.game.currentConflict || context.game.currentConflict.element === 'air') {
            context.game.addMessage(
                '{0} chooses not to resolve the {1} ring',
                context.player,
                context.game.currentConflict ? 'air' : undefined
            );
            this.onResolution(false);
        }
    }
}
