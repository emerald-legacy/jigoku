import DrawCard from '../../drawcard.js';

class IaijutsuMaster extends DrawCard {
    static id = 'iaijutsu-master';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'duelist'
        });

        this.reaction({
            title: 'Change your bid by 1 during a duel',
            when: {
                onHonorDialsRevealed: (event, context) =>
                    this.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent)
            },
            gameAction: ability.actions.modifyBid({ direction: 'prompt' })
        });
    }
}


export default IaijutsuMaster;
