import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { countCardsUnderneath, playableFromUnderneath } from '../../cardsUnderneath.js';

export default class DisloyalOathkeeper extends DrawCard {
    static id = 'disloyal-oathkeeper';

    public override setupCardAbilities() {
        this.persistentEffect(playableFromUnderneath());

        this.reaction('Put card under this')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player.opponent &&
                    event.card.type === CardType.Event &&
                    !event.card.hasEphemeral() &&
                    countCardsUnderneath(context.source) === 0
            })
            .placeCardUnderneath((context) => ({
                target: context.event.card,
                hideWhenFaceup: false,
                destination: context.source
            }));
    }
}
