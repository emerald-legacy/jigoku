import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

class ParagonOfGrace extends DrawCard {
    static id = 'paragon-of-grace';

    override setupCardAbilities() {
        this.action('Discard opponent\'s card')
            .condition((context) =>
                context.source.isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1)
            .discardAtRandom((context) => ({ target: context.source.isHonored ? context.player.opponent : [] }))
            .chosenDiscard((context) => ({ target: context.source.isHonored ? [] : context.player.opponent }))
            .chatText((context) => msg`make ${context.player.opponent ?? ''} discard 1 card${context.source.isHonored ? ' at random' : ''}`);
    }
}


export default ParagonOfGrace;
