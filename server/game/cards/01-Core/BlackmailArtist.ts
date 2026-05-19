import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class BlackmailArtist extends DrawCard {
    static id = 'blackmail-artist';

    setupCardAbilities() {
        this.reaction({
            title: 'Take 1 honor',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller &&
                                                   context.player.opponent && event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.takeHonor()
        });
    }
}


export default BlackmailArtist;
