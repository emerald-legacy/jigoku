import { placeCardUnderneath } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { playableFromUnderneath } from '../../cardsUnderneath.js';

export default class DisloyalOathkeeper extends DrawCard {
    static id = 'disloyal-oathkeeper';

    public setupCardAbilities() {
        this.persistentEffect(playableFromUnderneath(this));

        this.reaction('Put card under this')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player.opponent &&
                    event.card.type === CardType.Event &&
                    !event.card.hasEphemeral() &&
                    context.source.controller.getSourceList(this.uuid).length === 0
            })
            .gameAction(placeCardUnderneath((context) => ({
                target: context.event.card,
                hideWhenFaceup: true,
                destination: this
            })));
    }
}
