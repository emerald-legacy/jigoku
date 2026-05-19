import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class TheStranger extends DrawCard {
    static id = 'the-stranger';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                onClaimFavor: (event, context) => event.player === context.player
            },
            gameAction: AbilityDsl.actions.gainHonor(),
            limit: AbilityDsl.limit.perRound(2)
        });
    }
}
