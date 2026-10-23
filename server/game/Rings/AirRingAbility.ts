import { msg } from '../GameChat.js';
import { TargetMode } from '../Constants.js';
import { calculateHonorLimit } from '../GameActions/Shared/HonorLogic.js';
import type { AbilityContext } from '../AbilityContext.js';
import { BaseAbility } from '../BaseAbility.js';
import { AIR_CHOICE, type GameRules } from '../GameRules.js';
import { gainHonor, takeHonor } from '../GameActions/GameActions.js';

export class AirRingAbility extends BaseAbility {
    public override title = 'Air Ring Effect';
    public override cannotTargetFirst = true;
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

    public override executeHandler(context: AbilityContext): void {
        if(context.select === AIR_CHOICE.GAIN_2) {
            const [, amountToTransfer] = calculateHonorLimit(
                context.player,
                context.game.roundNumber,
                context.game.currentPhase,
                2
            );
            context.game.addMessage(msg`${context.player} resolves the ${'air'} ring, gaining ${amountToTransfer} honor`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'air', playerName: context.player.name, effect: 'gain-honor' });
            return gainHonor({ amount: 2 }).resolve(context.player, context);
        }
        if(context.select === AIR_CHOICE.TAKE_1) {
            context.game.addMessage(msg`${context.player} resolves the ${'air'} ring, taking 1 honor from ${context.player.opponent}`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'air', playerName: context.player.name, effect: 'take-honor' });
            return takeHonor().resolve(context.player.opponent, context);
        }
        context.game.addMessage(msg`${context.player} chooses not to resolve the ${'air'} ring`);
        this.onResolution(false);
    }
}
