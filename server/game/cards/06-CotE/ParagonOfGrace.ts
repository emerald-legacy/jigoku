import DrawCard from '../../DrawCard.js';
import { chosenDiscard, discardAtRandom, multiple } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

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
            .effect((context) => msg`make ${context.player.opponent ?? ''} discard 1 card${context.source.isHonored ? ' at random' : ''}`);
    }
}


export default ParagonOfGrace;
