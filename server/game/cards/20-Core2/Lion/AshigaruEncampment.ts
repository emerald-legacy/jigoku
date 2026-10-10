import { msg } from '../../../GameChat.js';
import { CardType, DeckType } from '../../../Constants.js';
import { putIntoPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { AshigaruRecruit } from '../../AshigaruRecruit.js';

/** The token as the chat shows it: a card fragment, so its name can be hovered. */
const recruitInChat = {
    id: 'ashigaru-recruit',
    label: 'Ashigaru Recruit',
    name: 'Ashigaru Recruit',
    facedown: false,
    type: CardType.Character
};

export default class AshigaruEncampment extends DrawCard {
    static id = 'ashigaru-encampment';

    setupCardAbilities() {
        this.action('Recruit a fresh Ashigaru')
            .tokenFromTopCard({
                deck: DeckType.Dynasty,
                token: AshigaruRecruit,
                gameAction: (token) => putIntoPlay({ target: token })
            })
            .chatText(() => msg`recruit ${recruitInChat}`);
    }
}
