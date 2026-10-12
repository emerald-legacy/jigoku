import { modifyDuelSkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class PromisingKohai extends DrawCard {
    static id = 'promising-kohai';

    setupCardAbilities() {
        this.duelChallenge('Add +2 to your duel total', (duel, context) =>
            duel.participants.some((a) => a.controller === context.source.controller && a !== context.source))
            .duelLastingEffect((context) => ({
                effect: modifyDuelSkill({ amount: 2, player: context.player })
            }))
            .chatText('add 2 to their duel total');
    }
}
