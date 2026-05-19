import DrawCard from '../../drawcard.js';

class WatchCommander extends DrawCard {
    static id = 'watch-commander';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.reaction({
            title: 'Force opponent to lose 1 honor',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => context.source.parent && event.player === context.player.opponent && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.loseHonor()
        });
    }
}


export default WatchCommander;
