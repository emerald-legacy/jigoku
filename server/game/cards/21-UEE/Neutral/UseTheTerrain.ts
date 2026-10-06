import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class UseTheTerrain extends DrawCard {
    static id = 'use-the-terrain';

    setupCardAbilities() {
        this.conflictAction('Give each character a military bonus', { conflictType: ConflictType.Military })
            .gameAction(cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: modifyMilitarySkill(this.hasKicker(context) ? 2 : 1)
            })))
            .effect('give all characters they control +{1}{2}', (context) => [this.hasKicker(context) ? 2 : 1, 'military']);
    }

    private hasKicker(context: AbilityContext<this>) {
        return context.player.isCharacterTraitInPlay('scout');
    }
}
