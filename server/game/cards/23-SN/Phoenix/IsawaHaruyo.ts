import { msg } from '../../../GameChat.js';
import { lookAt, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { chooseCardToDiscard, randomHandCards } from '../../randomHandCards.js';

export default class IsawaHaruyo extends DrawCard {
    static id = 'isawa-haruyo';

    public setupCardAbilities() {
        this.conflictAction('Discard a card')
            .condition((context) => context.source.isDefending() && context.player.opponent !== undefined)
            .selectAttackedProvince((context) => ({
                cardCondition: (card) => card.getStrength() > 0,
                gameAction: (province) => multiple(() => {
                    const cards = randomHandCards(context.player.opponent, province.getStrength());
                    return [
                        lookAt(() => ({
                            target: cards
                        })),
                        chooseCardToDiscard(cards)
                    ];
                })
            }))
            .chatText((context) => msg`look at an amount of random cards in ${context.player.opponent}'s hand equal to the strength of an attacked province and discard one of them`);
    }
}
