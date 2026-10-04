import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class ShinjoShono extends DrawCard {
    static id = 'shinjo-shono';

    setupCardAbilities() {
        this.action('Increase skill of friendly cavalry')
            .condition((context) => context.source.isParticipating() &&
                                  (context.game.currentConflict?.hasMoreParticipants(context.player) ?? false))
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player).filter(card => card.hasTrait('cavalry')) ?? [],
                effect: AbilityDsl.effects.modifyBothSkills(1)
            })))
            .effect('give friendly, participating cavalry +1/+1');
    }
}


export default ShinjoShono;
