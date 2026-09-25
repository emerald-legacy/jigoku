import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class ShinjoShono extends DrawCard {
    static id = 'shinjo-shono';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Increase skill of friendly cavalry')
            .condition((context) => context.source.isParticipating() &&
                                  (context.game.currentConflict?.hasMoreParticipants(context.player, () => true) ?? false))
            .gameAction(ability.actions.cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player).filter(card => card.hasTrait('cavalry')) ?? [],
                effect: ability.effects.modifyBothSkills(1)
            })))
            .effect('give friendly, participating cavalry +1/+1');
    }
}


export default ShinjoShono;
