import { unlimited } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class YasukiYoshi extends DrawCard {
    static id = 'yasuki-yoshi';

    setupCardAbilities() {
        this.tutored('Writ of Survey');

        this.reaction('Cause honor loss to the conflict loser')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .loseHonor((context) => ({
                target: context.event.conflict.loser
            }))
            .limit(unlimited());
    }
}
