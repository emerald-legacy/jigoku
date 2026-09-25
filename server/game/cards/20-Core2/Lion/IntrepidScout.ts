import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class IntrepidScout extends DrawCard {
    static id = 'intrepid-scout';

    setupCardAbilities() {
        this.action('Move a character to the conflict')
            .condition((context) => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.moveToConflict());
    }
}
