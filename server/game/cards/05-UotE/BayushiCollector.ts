import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, CharacterStatus } from '../../Constants.js';

class BayushiCollector extends DrawCard {
    static id = 'bayushi-collector';

    setupCardAbilities() {
        this.action('Discard an attachment and a status token')
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isDishonored)
            }, AbilityDsl.actions.discardFromPlay(), AbilityDsl.actions.discardStatusToken((context) => ({
                target: context.target.parentCharacter?.getStatusToken(CharacterStatus.Dishonored)
            })));
    }
}


export default BayushiCollector;
