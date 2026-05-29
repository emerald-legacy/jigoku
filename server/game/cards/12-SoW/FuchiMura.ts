import { ProvinceCard } from '../../ProvinceCard.js';
import type Ring from '../../Ring.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FuchiMura extends ProvinceCard {
    static id = 'fuchi-mura';

    setupCardAbilities() {
        this.reaction({
            title: 'Place one fate on each unclaimed ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            gameAction: AbilityDsl.actions.placeFateOnRing((context) => ({
                target: (Object.values(context.game.rings) as Ring[]).filter((ring) => ring.isUnclaimed())
            }))
        });
    }
}
