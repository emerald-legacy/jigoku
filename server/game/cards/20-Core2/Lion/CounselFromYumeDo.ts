import { msg } from '../../../GameChat.js';
import { returnToDeck } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players, TargetMode, Trait } from '../../../Constants.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import DrawCard from '../../../DrawCard.js';

export default class CounselFromYumeDo extends DrawCard {
    static id = 'counsel-from-yume-do';

    public setupCardAbilities() {
        this.action('Shuffle cards back into your deck')
            .condition((context) => controlsShugenja(context.player))
            .targetCards({
                mode: TargetMode.UpTo,
                activePromptTitle: 'Choose up to 3 conflict cards',
                numCards: 3,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                controller: Players.Self
            }, returnToDeck({ location: Location.ConflictDiscardPile, shuffle: true }))
            .afterwards()
            .onAffinity(Trait.Water, { chatText: () => msg`draw a card` })
            .draw();
    }
}
