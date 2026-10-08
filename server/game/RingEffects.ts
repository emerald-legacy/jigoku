import { AirRingEffect } from './Rings/AirRingEffect.js';
import { EarthRingEffect } from './Rings/EarthRingEffect.js';
import { FireRingEffect } from './Rings/FireRingEffect.js';
import { VoidRingEffect } from './Rings/VoidRingEffect.js';
import { WaterRingEffect } from './Rings/WaterRingEffect.js';
import { AbilityContext } from './AbilityContext.js';
import { BaseAbility } from './BaseAbility.js';
import Player from './Player.js';
import type { GameMode } from './GameMode.js';
import { Element } from './Constants.js';

interface RingAbility extends BaseAbility {
    title: string;
    cannotTargetFirst: boolean;
    defaultPriority: number;
    executeHandler(context: AbilityContext): void;
}

type ResolutionCb = (resolved: boolean) => void;

function ringForElement(element: Element) {
    switch(element) {
        case Element.Air:
            return (optional: boolean, rules: GameMode, onResolution: ResolutionCb) =>
                new AirRingEffect(optional, rules, onResolution);
        case Element.Earth:
            return (optional: boolean, rules: GameMode, onResolution: ResolutionCb) =>
                new EarthRingEffect(optional, rules, onResolution);
        case Element.Fire:
            return (optional: boolean, _rules: GameMode, onResolution: ResolutionCb) =>
                new FireRingEffect(optional, onResolution);
        case Element.Void:
            return (optional: boolean, _rules: GameMode, onResolution: ResolutionCb) =>
                new VoidRingEffect(optional, onResolution);
        case Element.Water:
            return (optional: boolean, rules: GameMode, onResolution: ResolutionCb) =>
                new WaterRingEffect(optional, rules, onResolution);
        default:
            throw new Error(`Unknown ring effect of ${element}`);
    }
}

export class RingEffects {
    static contextFor(
        player: Player,
        element: Element,
        optional = true,
        onResolution: ResolutionCb = () => {}
    ): AbilityContext & { ability: RingAbility } {
        const ring = ringForElement(element);
        const context = new AbilityContext({
            game: player.game,
            player,
            source: player.game.rings[element]
        });
        return Object.assign(context, { ability: ring(optional, context.game.rules, onResolution) });
    }

    static getRingName(element: string) {
        switch(element) {
            case 'air':
                return 'Air Ring';
            case 'earth':
                return 'Earth Ring';
            case 'fire':
                return 'Fire Ring';
            case 'void':
                return 'Void Ring';
            case 'water':
                return 'Water Ring';
            default:
                return undefined;
        }
    }
}
