import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, CharacterStatus } from '../../Constants.js';

class BayushiCollector extends DrawCard {
    static id = 'bayushi-collector';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Discard an attachment and a status token')
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isDishonored)
            }, ability.actions.discardFromPlay(), ability.actions.discardStatusToken((context) => ({
                target: (context.target).parentCharacter?.getStatusToken(CharacterStatus.Dishonored)
            })));
    }
}


export default BayushiCollector;
