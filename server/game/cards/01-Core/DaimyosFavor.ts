import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class DaimyosFavor extends DrawCard {
    static id = 'daimyo-s-favor';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Bow to reduce attachment cost')
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.reduceCost({
                    amount: 1,
                    cardType: CardType.Attachment,
                    targetCondition: target => target === context.source.parentCharacter,
                    limit: AbilityDsl.limit.fixed(1)
                })
            })))
            .effect('reduce the cost of the next attachment they play on {1} by 1', context => context.source.parentCharacter);
    }
}


export default DaimyosFavor;
