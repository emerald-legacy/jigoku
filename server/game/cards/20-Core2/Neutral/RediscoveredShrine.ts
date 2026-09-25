import { CardType } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseAction from '../../../BaseAction.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class RediscoveredShrine extends DrawCard {
    static id = 'rediscovered-shrine';

    setupCardAbilities() {
        this.interrupt('Reduce cost of next event')
            .when({
                onCardPlayed: (event, context) => {
                    const province = context.player.getProvinceCardInProvince(context.source.location);
                    return event.card.type === CardType.Event &&
                        event.player === context.player &&
                        !!province && !province.isBroken &&
                        (event.context?.ability as BaseAction)?.getReducedCost(event.context as AbilityContext) > 0;
                }
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: DrawCard) => card === (context as TriggeredAbilityContext).event.card
                )
            })))
            .effect('reduce the cost of their next event by 1');
    }
}
