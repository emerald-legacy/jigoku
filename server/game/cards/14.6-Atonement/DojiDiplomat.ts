import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import { reveal } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class DojiDiplomat extends DrawCard {
    static id = 'doji-diplomat';

    setupCardAbilities() {
        this.reaction('Reveal provinces')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                name: 'myProvince',
                cardType: CardType.Province,
                controller: Players.Opponent,
                location: Location.Provinces
            }, reveal())
            .target({
                name: 'oppProvince',
                player: Players.Opponent,
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces
            }, reveal())
            .chatText((context) => msg`reveal ${context.targets.myProvince} and ${context.targets.oppProvince}`);
    }
}


export default DojiDiplomat;
