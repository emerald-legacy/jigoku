import AbilityDsl from '../../../abilitydsl.js';
import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class StrikeFromTheShadows extends DrawCard {
    static id = 'strike-from-the-shadows';

    setupCardAbilities() {
        this.wouldInterrupt('Give Shinobi +1/+1')
            .when({
                afterConflict: (_event, context) => context.player.cardsInPlay.filter((card) => card.isParticipating() && card.hasTrait('shinobi')).length > 0
            })
            .cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter((card) => card.isParticipating() && card.hasTrait('shinobi')),
                effect: [
                    modifyBothSkills(1)
                ]
            }))
            .effect(() => msg`give all participating Shinobi they control +1${'military'}/+1${'political'} until the end of the conflict`)
            .max(AbilityDsl.limit.perConflict(1));
    }
}
