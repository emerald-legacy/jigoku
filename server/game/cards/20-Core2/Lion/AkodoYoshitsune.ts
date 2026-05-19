import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../conflict.js';
import DrawCard from '../../../drawcard.js';

export default class AkodoYoshitsune extends DrawCard {
    static id = 'akodo-yoshitsune';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain an honor',
            when: {
                afterConflict: (event, context) => (event.conflict as Conflict | undefined)?.winner === context.player
            },
            gameAction: AbilityDsl.actions.gainHonor((context) => ({ target: context.player })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}
