import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
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
                    cardType: CardType.Province,
                    controller: Players.Opponent,
                    location: Location.Provinces,
                    gameAction: AbilityDsl.actions.reveal()
                },
                oppProvince: {
                    player: Players.Opponent,
                    controller: Players.Self,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    gameAction: AbilityDsl.actions.reveal()
                }
            },
            effect: 'reveal {1} and {2}',
            effectArgs: context => [context.targets.myProvince, context.targets.oppProvince]
        });
    }
}


export default DojiDiplomat;
