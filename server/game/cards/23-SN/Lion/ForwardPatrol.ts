import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ForwardPatrol extends DrawCard {
    static id = 'forward-patrol';

    setupCardAbilities() {
        this.conflictAction('Ready a character')
            .target('target', {
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                cardType: CardType.Character
            }, AbilityDsl.actions.ready());
    }
}
