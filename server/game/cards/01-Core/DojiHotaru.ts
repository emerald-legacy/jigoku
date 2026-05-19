import DrawCard from '../../drawcard.js';

class DojiHotaru extends DrawCard {
    static id = 'doji-hotaru';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('political') && context.source.isParticipating() &&
                                                 event.player === context.player
            },
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}


export default DojiHotaru;
