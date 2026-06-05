import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class IkomaTsanuri extends DrawCard {
    static id = 'ikoma-tsanuri';

    setupCardAbilities() {
        this.action({
            title: 'Give your characters +1/+1',
            condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating() &&
                                  context.player.cardsInPlay.filter((card) => card.isParticipating() && card.hasTrait('bushi')).length > 2,
            effect: 'grant their participating characters +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                target: context.player.cardsInPlay.filter((card) => card.isParticipating()),
                effect: AbilityDsl.effects.modifyBothSkills(1)
            }))
        });
    }
}


export default IkomaTsanuri;
