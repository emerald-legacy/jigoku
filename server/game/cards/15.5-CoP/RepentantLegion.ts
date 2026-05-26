import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventNames, Locations } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class RepentantLegion extends DrawCard {
    static id = 'repentant-legion';

    setupCardAbilities() {
        this.reaction({
            title: 'fill provinces with a card',
            when: {
                onBreakProvince: (event: EventPayload<EventNames.OnBreakProvince>, context) => context.source.isParticipating() && (event.conflict?.getConflictProvinces().some((a: any) => a.owner !== context.player) ?? false)
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.dynastyDeck[0],
                    destination: Locations.ProvinceOne
                })),
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.dynastyDeck[0],
                    destination: Locations.ProvinceTwo
                })),
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.dynastyDeck[0],
                    destination: Locations.ProvinceThree
                })),
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.dynastyDeck[0],
                    destination: Locations.ProvinceFour
                }))
            ]),
            effect: 'put 1 card into each of their non-stronghold provinces.'
        });
    }
}


export default RepentantLegion;
