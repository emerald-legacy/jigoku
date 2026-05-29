import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class ShinjoShono extends DrawCard {
    static id = 'shinjo-shono';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Increase skill of friendly cavalry',
            condition: (context: any) => context.source.isParticipating() &&
                                  (context.game.currentConflict?.hasMoreParticipants(context.player, (() => true) as any) ?? false),
            effect: 'give friendly, participating cavalry +1/+1',
            gameAction: ability.actions.cardLastingEffect((context: any) => ({
                target: this.game.currentConflict?.getCharacters(context.player).filter((card: any) => card.hasTrait('cavalry')) ?? [],
                effect: ability.effects.modifyBothSkills(1)
            }))
        });
    }
}


export default ShinjoShono;
