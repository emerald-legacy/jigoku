import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { immunity } from '../../effects.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { CardType, Location, RestrictionScope } from '../../Constants.js';

class AkodoKaede extends DrawCard {
    static id = 'akodo-kaede';

    setupCardAbilities() {
        this.persistentEffect({
            effect: immunity({
                appliesTo: RestrictionScope.OpponentsRingEffects
            })
        });

        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.type === CardType.Character && event.card !== context.source && event.card.location === Location.PlayArea
            })
            .cancel((context) => ({
                target: context.source,
                replacementGameAction: removeFate()
            }))
            .chatText((context) => msg`prevent ${context.event.card} from leaving play`);
    }
}


export default AkodoKaede;

