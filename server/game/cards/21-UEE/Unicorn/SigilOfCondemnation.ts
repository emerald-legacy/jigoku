import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.action({
            title: 'Discard the attached character',
            condition: (context) =>
                this.game.isDuringConflict('military') &&
                context.source.parent &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) <
                context.game.currentConflict.getNumberOfParticipantsFor(context.player),
            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => context.source.parent.getFate() === 0,
                trueGameAction: AbilityDsl.actions.discardFromPlay(),
                falseGameAction: AbilityDsl.actions.removeFate()
            })
        });
    }
}
