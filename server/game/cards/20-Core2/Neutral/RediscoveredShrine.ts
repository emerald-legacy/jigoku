import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class RediscoveredShrine extends DrawCard {
    static id = 'rediscovered-shrine';

    setupCardAbilities() {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onCardPlayed: (event, context) => {
                    const province = context.player.getProvinceCardInProvince(context.source.location);
                    return event.card.type === CardTypes.Event &&
                        event.player === context.player &&
                        !!province && !province.isBroken &&
                        (event.context?.ability as any)?.getReducedCost(event.context) > 0;
                }
            },
            effect: 'reduce the cost of their next event by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: DrawCard) => card === (context as any).event.card
                )
            }))
        });
    }
}
