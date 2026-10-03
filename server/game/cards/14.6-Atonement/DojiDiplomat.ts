import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiDiplomat extends DrawCard {
    static id = 'doji-diplomat';

    setupCardAbilities() {
        this.reaction('Reveal provinces')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target('myProvince', {
                cardType: CardType.Province,
                controller: Players.Opponent,
                location: Location.Provinces
            }, AbilityDsl.actions.reveal())
            .target('oppProvince', {
                player: Players.Opponent,
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces
            }, AbilityDsl.actions.reveal())
            .effect('reveal {1} and {2}', context => [context.targets.myProvince, context.targets.oppProvince]);
    }
}


export default DojiDiplomat;
