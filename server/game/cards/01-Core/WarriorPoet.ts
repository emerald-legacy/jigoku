import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class WarriorPoet extends DrawCard {
    static id = 'warrior-poet';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Reduce skill of opponent\'s characters',
            condition: (context: any) => context.source.isParticipating(),
            effect: 'reduce the skill of all opposing characters',
            gameAction: ability.actions.cardLastingEffect((context: any) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: ability.effects.modifyBothSkills(-1)
            }))
        });
    }
}


export default WarriorPoet;
