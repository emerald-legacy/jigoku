import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class UseTheTerrain extends DrawCard {
    static id = 'use-the-terrain';

    setupCardAbilities() {
        this.conflictAction('Give each character a military bonus', { conflictType: ConflictType.Military })
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: modifyMilitarySkill(this.hasKicker(context) ? 2 : 1)
            }))
            .chatText((context) => msg`give all characters they control +${this.hasKicker(context) ? 2 : 1}${'military'}`);
    }

    private hasKicker(context: AbilityContext<this>) {
        return context.player.isCharacterTraitInPlay('scout');
    }
}
