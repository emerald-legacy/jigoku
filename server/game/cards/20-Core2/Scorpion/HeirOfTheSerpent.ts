import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class HeirOfTheSerpent extends DrawCard {
    static id = 'heir-of-the-serpent';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            condition: (context) => (context.source as DrawCard).isParticipating(),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.moveToConflict()
                ])
            }
        });
    }
}
