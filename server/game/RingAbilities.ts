import { AirRingAbility } from './Rings/AirRingAbility.js';
import { EarthRingAbility } from './Rings/EarthRingAbility.js';
import { FireRingAbility } from './Rings/FireRingAbility.js';
import { VoidRingAbility } from './Rings/VoidRingAbility.js';
import { WaterRingAbility } from './Rings/WaterRingAbility.js';
import { AbilityContext } from './AbilityContext.js';
import { BaseAbility } from './BaseAbility.js';
import Player from './Player.js';
import type { GameRules } from './GameRules.js';
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
            return (optional: boolean, rules: GameRules, onResolution: ResolutionCb) =>
                new AirRingAbility(optional, rules, onResolution);
        case Element.Earth:
            return (optional: boolean, rules: GameRules, onResolution: ResolutionCb) =>
                new EarthRingAbility(optional, rules, onResolution);
        case Element.Fire:
            return (optional: boolean, _rules: GameRules, onResolution: ResolutionCb) =>
                new FireRingAbility(optional, onResolution);
        case Element.Void:
            return (optional: boolean, _rules: GameRules, onResolution: ResolutionCb) =>
                new VoidRingAbility(optional, onResolution);
        case Element.Water:
            return (optional: boolean, rules: GameRules, onResolution: ResolutionCb) =>
                new WaterRingAbility(optional, rules, onResolution);
        default:
            throw new Error(`Unknown ring effect of ${element}`);
    }
}

export class RingAbilities {
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
