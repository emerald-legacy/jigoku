import DrawCard from '../../DrawCard.js';
import { moveCard, sequential } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class RepentantLegion extends DrawCard {
    static id = 'repentant-legion';

    setupCardAbilities() {
        this.reaction('fill provinces with a card')
            .when({
                // RRG: a province broken outside conflict resolution is broken by its controller's opponent
                onBreakProvince: (event, context) => context.source.isParticipating() && event.card.controller !== context.player
            })
            .gameAction(sequential([
                moveCard((context) => ({
                    target: context.player.dynastyDeck[0],
                    destination: Location.ProvinceOne
                })),
                moveCard((context) => ({
                    target: context.player.dynastyDeck[0],
                    destination: Location.ProvinceTwo
                })),
                moveCard((context) => ({
                    target: context.player.dynastyDeck[0],
                    destination: Location.ProvinceThree
                })),
                moveCard((context) => ({
                    target: context.player.dynastyDeck[0],
                    destination: Location.ProvinceFour
                }))
            ]))
            .chatText('put 1 card into each of their non-stronghold provinces');
    }
}


export default RepentantLegion;
