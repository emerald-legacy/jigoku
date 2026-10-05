import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';

class IuchiFarseer extends DrawCard {
    static id = 'iuchi-farseer';

    setupCardAbilities() {
        this.reaction('Reveal an opponent\'s province')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent
            }, AbilityDsl.actions.reveal())
            .effect('reveal {0}');
    }
}


export default IuchiFarseer;
