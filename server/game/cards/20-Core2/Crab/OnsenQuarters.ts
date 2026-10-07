import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { resolveRingEffect } from '../../../GameActions/GameActions.js';
import type Ring from '../../../Ring.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class OnsenQuarters extends ProvinceCard {
    static id = 'onsen-quarters';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) =>
                !!context && card.type === CardType.Province && card !== context.source && card.controller === context.player,
            effect: modifyProvinceStrength(1)
        });

        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.getConflictProvinces().some((a) => a === context.source)
            })
            .gameAction(resolveRingEffect((context) => ({
                target: this.ringForRole(context),
                player: context.player
            })));
    }

    private ringForRole(context: AbilityContext): Ring | undefined {
        const role = context.player.role;
        if(!role) {
            return undefined;
        }
        for(const trait of role.traits) {
            const ring = context.game.ringFor(trait);
            if(ring) {
                return ring;
            }
        }
        return undefined;
    }
}
