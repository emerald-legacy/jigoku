import type { AbilityContext } from '../AbilityContext.js';
import { Locations } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { Event } from '../Events/Event.js';
export interface FillProvinceProperties extends PlayerActionProperties {
    location: Locations;
    fillTo?: number;
    faceup?: boolean;
}

export class FillProvinceAction extends PlayerAction<FillProvinceProperties> {
    defaultProperties: FillProvinceProperties = { location: Locations.ProvinceOne, fillTo: 1, faceup: false };
    name = 'fill';
    effect = 'fills {0} with more cards';

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as FillProvinceProperties;
        return ['fills {0} to {1} cards!', [properties.location, properties.fillTo]];
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context as AbilityContext;
        let properties = this.getProperties(context, additionalProperties) as FillProvinceProperties;
        const player = event.player as Player;
        let currentCards = player.getDynastyCardsInProvince(properties.location).length;
        player.refillProvince(properties.location, (properties.fillTo ?? 0) - currentCards);

        if(properties.faceup) {
            context.game.queueSimpleStep(() => {
                let cards = player.getDynastyCardsInProvince(properties.location);
                cards.forEach((card: any) => {
                    if(card) {
                        card.facedown = false;
                    }
                });
            });
        }
    }
}
