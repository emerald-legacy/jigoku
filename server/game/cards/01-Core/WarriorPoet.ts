import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

class WarriorPoet extends DrawCard {
    static id = 'warrior-poet';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Reduce skill of opponent\'s characters',
            condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating(),
            effect: 'reduce the skill of all opposing characters',
            gameAction: ability.actions.cardLastingEffect((context: AbilityContext) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: ability.effects.modifyBothSkills(-1)
            }))
        });
    }
}


export default WarriorPoet;
