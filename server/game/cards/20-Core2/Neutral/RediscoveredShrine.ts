import { CardType } from '../../../Constants.js';
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
                        !!event.context && event.context.ability.getReducedCost(event.context) > 0;
                }
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: DrawCard) => card === context.event.card
                )
            })))
            .effect('reduce the cost of their next event by 1');
    }
}
