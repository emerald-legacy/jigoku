import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class HeirOfTheSerpent extends DrawCard {
    static id = 'heir-of-the-serpent';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .condition((context) => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.sendHome(),
                AbilityDsl.actions.moveToConflict()
            ]));
    }
}
