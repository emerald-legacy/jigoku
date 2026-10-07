import { CardType, Location } from '../../../Constants.js';
import { lookAt, multipleContext } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { chooseCardToDiscard, randomHandCards } from '../../randomHandCards.js';

export default class IsawaHaruyo extends DrawCard {
    static id = 'isawa-haruyo';

    public setupCardAbilities() {
        this.conflictAction('Discard a card')
            .condition((context) => context.source.isDefending() && context.player.opponent !== undefined)
            .selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.isProvinceCard() && card.getStrength() > 0,
                subActionProperties: (card) => {
                    context.target = card;
                    return { target: card };
                },
                gameAction: multipleContext((context: AbilityContext<this>) => {
                    const cardNumber = context.target?.isProvinceCard() ? context.target.getStrength() : 0;
                    const cards = randomHandCards(context.player.opponent, cardNumber);
                    return {
                        gameActions: [
                            lookAt(() => ({
                                target: cards
                            })),
                            chooseCardToDiscard(cards)
                        ]
                    };
                })
            }))
            .effect('look at an amount of random cards in {1}\'s hand equal to the strength of an attacked province and discard one of them', (context) => [
                context.player.opponent
            ]);
    }
}
