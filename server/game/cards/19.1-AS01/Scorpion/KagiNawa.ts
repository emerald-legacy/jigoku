import AbilityDsl from '../../../abilitydsl.js';
import { AbilityTypes, CardTypes, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type { ActionProps } from '../../../Interfaces.js';

export default class KagiNawa extends DrawCard {
    static id = 'kagi-nawa';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Move a character to the conflict',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    activePromptTitle: 'Choose a character with printed cost 2 or lower to move in',
                    cardCondition: (card) => card.printedCost <= 2,
                    gameAction: AbilityDsl.actions.moveToConflict()
                },
                effect: 'hook {0} and drag them into the conflict'
            } as ActionProps<this>)
        });
    }
}
