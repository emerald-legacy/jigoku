import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SubdueTheSpirits extends DrawCard {
    static id = 'subdue-the-spirits';

    setupCardAbilities() {
        this.action({
            title: 'Add glory to both skills',
            condition: context => this.game.isDuringConflict() && context.player && context.player.opponent && context.player.isMoreHonorable(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getCharacters(context.player),
                effect: AbilityDsl.effects.modifyBothSkills(card => card.glory)
            })),
            effect: 'add glory to {1} and {2} skills on participating characters they control',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default SubdueTheSpirits;
