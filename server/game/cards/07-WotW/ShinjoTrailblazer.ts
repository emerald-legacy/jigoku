import DrawCard from '../../drawcard.js';

class ShinjoTrailblazer extends DrawCard {
    static id = 'shinjo-trailblazer';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +2/+2',
            when: {
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            },
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            effect: 'give {0} +2{1}, +2{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default ShinjoTrailblazer;
