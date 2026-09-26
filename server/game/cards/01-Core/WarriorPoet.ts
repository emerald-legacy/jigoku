import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class WarriorPoet extends DrawCard {
    static id = 'warrior-poet';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Reduce skill of opponent\'s characters')
            .condition((context) => context.source.isParticipating())
            .gameAction(ability.actions.cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: ability.effects.modifyBothSkills(-1)
            })))
            .effect('reduce the skill of all opposing characters');
    }
}


export default WarriorPoet;
