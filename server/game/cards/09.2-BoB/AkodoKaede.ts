import DrawCard from '../../DrawCard.js';
import { immunity } from '../../effects.js';
import { cancel, removeFate } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class AkodoKaede extends DrawCard {
    static id = 'akodo-kaede';

    setupCardAbilities() {
        this.persistentEffect({
            effect: immunity({
                restricts: 'opponentsRingEffects'
            })
        });

        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.type === CardType.Character && event.card !== context.source && event.card.location === Location.PlayArea
            })
            .gameAction(cancel(context => ({
                target: context.source,
                replacementGameAction: removeFate()
            })))
            .effect('prevent {1} from leaving play', context => context.event.card);
    }
}


export default AkodoKaede;

