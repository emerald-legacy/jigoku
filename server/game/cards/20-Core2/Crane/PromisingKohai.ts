import { Duration } from '../../../Constants.js';
import { modifyDuelSkill } from '../../../effects.js';
import { duelLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class PromisingKohai extends DrawCard {
    static id = 'promising-kohai';

    setupCardAbilities() {
        this.duelChallenge('Add +2 to your duel total', (duel, context) =>
            duel.participants.some((a) => a.controller === context.source.controller && a !== context.source))
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: modifyDuelSkill({ amount: 2, player: context.player }),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('add 2 to their duel total');
    }
}
