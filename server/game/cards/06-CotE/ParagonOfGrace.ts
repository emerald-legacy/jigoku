import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ParagonOfGrace extends DrawCard {
    static id = 'paragon-of-grace';

    setupCardAbilities() {
        this.action('Discard opponent\'s card')
            .condition((context) =>
                context.source.isParticipatingFor(context.player) &&
                this.game.currentConflict?.getNumberOfParticipantsFor(context.player) === 1)
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardAtRandom((context) => ({ target: context.source.isHonored ? context.player.opponent : [] })),
                AbilityDsl.actions.chosenDiscard((context) => ({ target: context.source.isHonored ? [] : context.player.opponent }))
            ]))
            .effect('make {1} discard 1 card{2}', (context) => [context.player.opponent ?? '', context.source.isHonored ? ' at random' : '']);
    }
}


export default ParagonOfGrace;
