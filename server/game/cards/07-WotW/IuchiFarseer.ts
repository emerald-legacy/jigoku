import DrawCard from '../../drawcard.js';
import { CardTypes, Locations, Players } from '../../Constants.js';

class IuchiFarseer extends DrawCard {
    static id = 'iuchi-farseer';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Reveal an opponent\'s province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                gameAction: ability.actions.reveal()
            },
            effect: 'reveal {0}'
        });
    }
}


export default IuchiFarseer;
