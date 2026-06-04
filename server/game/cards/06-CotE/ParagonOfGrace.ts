import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class ParagonOfGrace extends DrawCard {
    static id = 'paragon-of-grace';

    setupCardAbilities() {
        this.action({
            title: 'Discard opponent\'s card',
            condition: (context: AbilityContext) =>
                (context.source as DrawCard).isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardAtRandom((context: AbilityContext) => ({ target: context.source.isHonored ? context.player.opponent : [] })),
                AbilityDsl.actions.chosenDiscard((context: AbilityContext) => ({ target: context.source.isHonored ? [] : context.player.opponent }))
            ]),
            effect: 'make {1} discard 1 card{2}',
            effectArgs: (context: AbilityContext) => [context.player.opponent ?? '', context.source.isHonored ? ' at random' : '']
        });
    }
}


export default ParagonOfGrace;
