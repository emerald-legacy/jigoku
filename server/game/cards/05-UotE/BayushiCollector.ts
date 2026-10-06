import { discardFromPlay, discardStatusToken } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, CharacterStatus } from '../../Constants.js';

class BayushiCollector extends DrawCard {
    static id = 'bayushi-collector';

    setupCardAbilities() {
        this.action('Discard an attachment and a status token')
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isDishonored)
            }, discardFromPlay(), discardStatusToken((context) => ({
                target: context.target.parentCharacter?.getStatusToken(CharacterStatus.Dishonored)
            })));
    }
}


export default BayushiCollector;
