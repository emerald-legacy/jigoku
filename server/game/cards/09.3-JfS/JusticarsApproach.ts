import { DuelType } from '../../Constants.js';

import type { GameAction } from '../../GameActions/GameAction.js';
import { gainAbility } from '../../effects.js';
import { bow, discardFromPlay, dishonor, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class JusticarsApproach extends DrawCard {
    static id = 'justicar-s-approach';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'courtier' });

        this.whileAttached({
            effect: gainAbility.action('Initiate a duel to dishonor/bow/discard', (ability) => ability
                .initiateDuel(() => ({
                    type: DuelType.Military,
                    gameAction: (duel) =>
                        multiple(
                            duel.loser?.map((loserChar) => this.effectsOnLoser(loserChar)) ?? []
                        )
                })))
        });
    }

    private effectsOnLoser(target: DrawCard): GameAction {
        const effects: GameAction[] = [dishonor({ target })];
        if(target.isDishonored) {
            effects.push(bow({ target }));
        }
        if(target.isDishonored && target.bowed) {
            effects.push(discardFromPlay({ target }));
        }

        return multiple(effects);
    }
}
