import DrawCard from '../../DrawCard.js';
import { chosenDiscard, discardAtRandom, multiple } from '../../GameActions/GameActions.js';

class ParagonOfGrace extends DrawCard {
    static id = 'paragon-of-grace';

    setupCardAbilities() {
        this.action('Discard opponent\'s card')
            .condition((context) =>
                context.source.isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1)
            .gameAction(multiple([
                discardAtRandom((context) => ({ target: context.source.isHonored ? context.player.opponent : [] })),
                chosenDiscard((context) => ({ target: context.source.isHonored ? [] : context.player.opponent }))
            ]))
            .effect('make {1} discard 1 card{2}', (context) => [context.player.opponent ?? '', context.source.isHonored ? ' at random' : '']);
    }
}


export default ParagonOfGrace;
