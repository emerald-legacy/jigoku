import { modifyBothSkills } from '../../../effects.js';
import { placeCardUnderneath, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { countCardsUnderneath, playableFromUnderneath } from '../../cardsUnderneath.js';
import { msg } from '../../../GameChat.js';

export default class TogashiTsurumi extends DrawCard {
    static id = 'togashi-tsurumi';

    public override setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBothSkills(() => countCardsUnderneath(this))
        });

        this.persistentEffect(playableFromUnderneath(this, (card) => card.hasTrait(Trait.Kiho)));

        this.action('Place a card underneath self')
            .gameAction(selectCard({
                activePromptTitle: 'Choose a card',
                location: Location.Hand,
                controller: Players.Self,
                cardType: [CardType.Event, CardType.Attachment, CardType.Character],
                targets: false,
                gameAction: placeCardUnderneath({ destination: this })
            }))
            .chatText((context) => msg`place a card from their hand beneath ${context.source} and draw a card`)
            .then()
            .draw((context) => ({ target: context.player }));
    }
}
