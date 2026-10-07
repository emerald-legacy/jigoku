import { TargetMode } from '../Constants.js';
import { AbilityContext } from '../AbilityContext.js';
import BaseAbility from '../BaseAbility.js';
import { EARTH_CHOICE, type GameMode } from '../GameMode.js';

export class EarthRingEffect extends BaseAbility {
    public title = 'Earth Ring Effect';
    public cannotTargetFirst = true;
    public defaultPriority = 1; // Default resolution priority when players have ordering switched off

    public constructor(
        optional: boolean,
        rules: GameMode,
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
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'earth');
            this.onResolution(false);
        } else if(context.select === EARTH_CHOICE.FORCE_DISCARD) {
            context.game.addMessage(
                '{0} resolves the {1} ring, forcing {2} to discard a card at random',
                context.player,
                'earth',
                context.player.opponent
            );
            this.onResolution(true);
            context.game.addAnimation({ type: 'earth', playerName: context.player.name, effect: 'force-discard' });
            context.game.actions.discardAtRandom().resolve(context.player.opponent, context);
        } else if(context.select === EARTH_CHOICE.DRAW_AND_FORCE_DISCARD && context.player.opponent) {
            context.game.addMessage(
                '{0} resolves the {1} ring, drawing a card and forcing {2} to discard a card at random',
                context.player,
                'earth',
                context.player.opponent
            );
            this.onResolution(true);
            context.game.addAnimation({ type: 'earth', playerName: context.player.name, effect: 'draw-discard' });
            context.game.applyGameAction(context, { draw: context.player, discardAtRandom: context.player.opponent });
        } else if(context.select === EARTH_CHOICE.DRAW) {
            context.game.addMessage('{0} resolves the {1} ring, drawing a card', context.player, 'earth');
            this.onResolution(true);
            context.game.addAnimation({ type: 'earth', playerName: context.player.name, effect: 'draw' });
            context.game.applyGameAction(context, { draw: context.player });
        }
    }
}
