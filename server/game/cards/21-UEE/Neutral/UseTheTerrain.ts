import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Durations } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

export default class UseTheTerrain extends DrawCard {
    static id = 'use-the-terrain';

    setupCardAbilities() {
        this.action({
            title: 'Give each character a military bonus',
            condition: (context) => context.game.isDuringConflict('military'),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#hasKicker(context) ? 2 : 1),
                duration: Durations.UntilEndOfConflict
            })),
            effect: 'give all characters they control +{1}{2}',
            effectArgs: (context) => [this.#hasKicker(context) ? 2 : 1, 'military']
        });
    }

    #hasKicker(context: AbilityContext<this>) {
        return context.player.isCharacterTraitInPlay('scout');
    }
}
