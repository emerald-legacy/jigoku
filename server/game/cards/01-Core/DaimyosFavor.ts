import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import { fixed } from '../../AbilityLimit.js';
import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class DaimyosFavor extends DrawCard {
    static id = 'daimyo-s-favor';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Bow to reduce attachment cost')
            .cost(costs.bowSelf())
            .playerLastingEffect((context) => {
                // "this character" is the one the Favor is on now, even if the Favor leaves play later
                const character = context.source.parentCharacter;
                return {
                    duration: Duration.UntilEndOfPhase,
                    effect: reduceCost({
                        amount: 1,
                        cardType: CardType.Attachment,
                        targetCondition: (target) => !!character && target === character,
                        limit: fixed(1)
                    })
                };
            })
            .chatText((context) => msg`reduce the cost of the next attachment they play on ${context.source.parentCharacter} by 1`);
    }
}


export default DaimyosFavor;
