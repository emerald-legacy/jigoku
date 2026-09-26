import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';

export default class ShinjoOyuun extends DrawCard {
    static id = 'shinjo-oyuun';

    setupCardAbilities() {
        this.conflictAction('Move a character into the conflict')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => {
                    if(!context.player.opponent) {
                        return false;
                    }
                    return card.printedCost !== null && card.printedCost <= context.player.opponent.getNumberOfFaceupProvinces();
                }
            }, AbilityDsl.actions.moveToConflict());
    }
}
