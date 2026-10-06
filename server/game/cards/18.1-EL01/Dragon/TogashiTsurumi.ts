import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { countCardsUnderneath, playableFromUnderneath } from '../../cardsUnderneath.js';

export default class TogashiTsurumi extends DrawCard {
    static id = 'togashi-tsurumi';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills(() => countCardsUnderneath(this))
        });

        this.persistentEffect(playableFromUnderneath(this, (card) => card.hasTrait('kiho')));

        this.action('Place a card underneath self')
            .target({
                activePromptTitle: 'Choose a card',
                location: Location.Hand,
                controller: Players.Self,
                cardType: [CardType.Event, CardType.Attachment, CardType.Character]
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.draw((context) => ({
                    target: context.player
                })),
                AbilityDsl.actions.placeCardUnderneath((context) => ({ destination: context.source }))
            ]))
            .effect('place a card from their hand beneath {1} and draw a card', (context) => [context.source]);
    }
}
