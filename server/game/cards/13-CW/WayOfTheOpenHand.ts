import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import { multiple, placeFate, sendHome } from '../../GameActions/GameActions.js';

class WayOfTheOpenHand extends DrawCard {
    static id = 'way-of-the-open-hand';

    setupCardAbilities() {
        this.action('Send home opponent\'s character')
            .condition(context => context.game.isDuringConflict() && !(context.game.currentConflict?.getConflictProvinces() ?? []).some(a => a.location === Location.StrongholdProvince))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller !== context.player
            }, multiple([
                sendHome(),
                placeFate()
            ]))
            .chatText('send home and place a fate on {0}');
    }
}


export default WayOfTheOpenHand;
