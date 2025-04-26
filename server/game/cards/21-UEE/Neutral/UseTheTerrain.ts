import type { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { Durations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export class UseTheTerrain extends DrawCard {
    static id = 'use-the-terrain';

    setupCardAbilities() {
        this.action({
            title: 'Give each character a military bonus',
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#hasKicker(context) ? 2 : 1),
                duration: Durations.UntilEndOfConflict
            })),
            effect: 'give all characters they control +{1}{2}',
            effectArgs: (context) => [this.#hasKicker(context) ? 2 : 1, 'military'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    #hasKicker(context: AbilityContext<this>) {
        return context.player.isCharacterTraitInPlay('scout');
    }
}
