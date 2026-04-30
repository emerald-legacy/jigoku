import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { Locations } from '../../Constants';

class RepentantLegion extends DrawCard {
    static id = 'repentant-legion';

    setupCardAbilities() {
        this.reaction({
            title: 'fill provinces with a card',
            when: {
                onBreakProvince: (event, context) => context.source.isParticipating() && event.conflict.getConflictProvinces().some(a => a.owner !== context.player)
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
