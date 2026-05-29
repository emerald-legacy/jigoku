import DrawCard from '../../DrawCard.js';
import { Players, CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiDiplomat extends DrawCard {
    static id = 'doji-diplomat';

    setupCardAbilities() {
        this.reaction({
            title: 'Reveal provinces',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            targets: {
                myProvince: {
                    cardType: CardTypes.Province,
                    controller: Players.Opponent,
                    location: Locations.Provinces,
                    gameAction: AbilityDsl.actions.reveal()
                },
                oppProvince: {
                    player: Players.Opponent,
                    controller: Players.Self,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    gameAction: AbilityDsl.actions.reveal()
                }
            },
            effect: 'reveal {1} and {2}',
            effectArgs: context => [context.targets.myProvince, context.targets.oppProvince]
        });
    }
}


export default DojiDiplomat;
