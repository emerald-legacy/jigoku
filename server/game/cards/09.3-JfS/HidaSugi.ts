import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class HidaSugi extends DrawCard {
    static id = 'hida-sugi';

    override setupCardAbilities() {
        this.reaction('Move a discarded dynasty card')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .target({
                location: Location.DynastyDiscardPile
            }, moveCard({ destination: Location.DynastyDeck, bottom: true}))
            .chatText((context) => msg`move ${context.chatTarget()} to bottom of ${context.target.controller}'s dynasty deck`);
    }
}


export default HidaSugi;

