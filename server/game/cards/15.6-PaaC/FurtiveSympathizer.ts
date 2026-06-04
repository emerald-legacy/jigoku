import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class FurtiveSympathizer extends DrawCard {
    static id = 'furtive-sympathizer';

    setupCardAbilities() {
        this.action({
            title: 'Switch each character\'s base skills',
            condition: context => context.source.isParticipating() && context.source.isOrdinary(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants().filter((a: DrawCard) => !a.hasDash()) ?? [],
                effect: AbilityDsl.effects.switchBaseSkills()
            })),
            effect: 'switch all participating character\'s base military and political skill'
        });
    }
}


export default FurtiveSympathizer;
