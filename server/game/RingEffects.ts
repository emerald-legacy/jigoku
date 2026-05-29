import { GameModes } from '../GameModes.js';
import { AirRingEffect } from './Rings/AirRingEffect.js';
import { EarthRingEffect } from './Rings/EarthRingEffect.js';
import { FireRingEffect } from './Rings/FireRingEffect.js';
import { VoidRingEffect } from './Rings/VoidRingEffect.js';
import { WaterRingEffect } from './Rings/WaterRingEffect.js';
import { AbilityContext } from './AbilityContext.js';
import BaseAbility from './BaseAbility.js';
import Player from './Player.js';

interface RingAbility extends BaseAbility {
    title: string;
    cannotTargetFirst: boolean;
    defaultPriority: number;
    executeHandler(context: AbilityContext): void;
}

type ResolutionCb = (resolved: boolean) => void;

function ringForElement(element: string) {
    switch(element) {
        case 'air':
            return (optional: boolean, gameMode: GameModes, onResolution: ResolutionCb) =>
                new AirRingEffect(optional, gameMode, onResolution);
        case 'earth':
            return (optional: boolean, gameMode: GameModes, onResolution: ResolutionCb) =>
                new EarthRingEffect(optional, gameMode, onResolution);
        case 'fire':
            return (optional: boolean, gameMode: GameModes, onResolution: ResolutionCb) =>
                new FireRingEffect(optional, onResolution);
        case 'void':
            return (optional: boolean, gameMode: GameModes, onResolution: ResolutionCb) =>
                new VoidRingEffect(optional, onResolution);
        case 'water':
            return (optional: boolean, gameMode: GameModes, onResolution: ResolutionCb) =>
                new WaterRingEffect(optional, gameMode, onResolution);
        default:
            throw new Error(`Unknown ring effect of ${element}`);
    }
}

export class RingEffects {
    static contextFor(
        player: Player,
        element: string,
        optional = true,
        onResolution: ResolutionCb = () => {}
    ): Omit<AbilityContext, 'ability'> & { ability: RingAbility } {
        const ring = ringForElement(element);
        const context: any = player.game.getFrameworkContext(player);
        context.source = player.game.rings[element];
        const gameModeWithDefault = context.game.gameMode || GameModes.Stronghold;
        context.ability = ring(optional, gameModeWithDefault, onResolution);
        return context;
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
