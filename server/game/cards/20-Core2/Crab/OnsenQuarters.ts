import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type Ring from '../../../Ring.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class OnsenQuarters extends ProvinceCard {
    static id = 'onsen-quarters';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            condition: () => true,
            match: (card, context) =>
                !!context && card.type === CardType.Province && card !== context?.source && card.controller === context?.player,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });

        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.getConflictProvinces().some((a: ProvinceCard) => a === context.source)
            },
            gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({
                target: this.#ringForRole(context),
                player: context.player
            }))
        });
    }

    #ringForRole(context: AbilityContext): Ring | undefined {
        const role = context.player.role;
        if(!role) {
            return undefined;
        }
        for(const trait of role.traits) {
            if(trait in context.game.rings) {
                return context.game.rings[trait];
            }
        }
        return undefined;
    }
}
