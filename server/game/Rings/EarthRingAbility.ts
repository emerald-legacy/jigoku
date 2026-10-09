import { msg } from '../GameChat.js';
import { TargetMode } from '../Constants.js';
import { AbilityContext } from '../AbilityContext.js';
import { BaseAbility } from '../BaseAbility.js';
import { EARTH_CHOICE, type GameRules } from '../GameRules.js';

export class EarthRingAbility extends BaseAbility {
    public title = 'Earth Ring Effect';
    public cannotTargetFirst = true;
    public defaultPriority = 1; // Default resolution priority when players have ordering switched off

    public constructor(
        optional: boolean,
        rules: GameRules,
        private onResolution = (_resolved: boolean) => {}
    ) {
        super({
            target: {
                mode: TargetMode.Select,
                activePromptTitle: 'Choose an effect to resolve',
                source: 'Earth Ring',
                choices: rules.ringEarthChoices(optional)
            }
        });
    }

    public executeHandler(context: AbilityContext): void {
        if(context.select === EARTH_CHOICE.SKIP) {
            context.game.addMessage(msg`${context.player} chooses not to resolve the ${'earth'} ring`);
            this.onResolution(false);
        } else if(context.select === EARTH_CHOICE.FORCE_DISCARD) {
            context.game.addMessage(msg`${context.player} resolves the ${'earth'} ring, forcing ${context.player.opponent} to discard a card at random`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'earth', playerName: context.player.name, effect: 'force-discard' });
            context.game.actions.discardAtRandom().resolve(context.player.opponent, context);
        } else if(context.select === EARTH_CHOICE.DRAW_AND_FORCE_DISCARD && context.player.opponent) {
            context.game.addMessage(msg`${context.player} resolves the ${'earth'} ring, drawing a card and forcing ${context.player.opponent} to discard a card at random`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'earth', playerName: context.player.name, effect: 'draw-discard' });
            context.game.applyGameAction(context, { draw: context.player, discardAtRandom: context.player.opponent });
        } else if(context.select === EARTH_CHOICE.DRAW) {
            context.game.addMessage(msg`${context.player} resolves the ${'earth'} ring, drawing a card`);
            this.onResolution(true);
            context.game.addAnimation({ type: 'earth', playerName: context.player.name, effect: 'draw' });
            context.game.applyGameAction(context, { draw: context.player });
        }
    }
}
