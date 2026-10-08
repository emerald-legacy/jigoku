import { msg } from '../../../GameChat.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import { discardFromPlay, placeFate, selectCards, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KotobukisBlessing extends DrawCard {
    static id = 'kotobuki-s-blessing';

    setupCardAbilities() {
        this.action('Place a fate on a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sequential([
                placeFate(),
                selectCards((context) => ({
                    mode: TargetMode.UpTo,
                    numCards: 1,
                    cardType: CardType.Attachment,
                    controller: Players.Any,
                    cardCondition: (card) => card.parentCharacter === context.target,
                    activePromptTitle: 'Choose up to 1 attachment',
                    optional: true,
                    gameAction: discardFromPlay(),
                    message: (context, cards) => msg`${context.player} chooses to discard ${cards.length === 0 ? 'no attachments' : cards} from ${context.target}`}))
            ]))
            .max(perRound(1));
    }
}
