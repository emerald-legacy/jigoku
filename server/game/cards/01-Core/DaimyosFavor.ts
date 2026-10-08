import * as costs from '../../costs/index.js';
import { fixed } from '../../AbilityLimit.js';
import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class DaimyosFavor extends DrawCard {
    static id = 'daimyo-s-favor';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Bow to reduce attachment cost')
            .cost(costs.bowSelf())
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: reduceCost({
                    amount: 1,
                    cardType: CardType.Attachment,
                    targetCondition: target => target === context.source.parentCharacter,
                    limit: fixed(1)
                })
            }))
            .chatText('reduce the cost of the next attachment they play on {1} by 1', context => context.source.parentCharacter);
    }
}


export default DaimyosFavor;
