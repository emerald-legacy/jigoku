import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.action({
            title: 'Injure attached character',
            condition: (context) =>
                this.game.isDuringConflict('military') &&
                context.source.parent &&
                context.source.parent.isParticipating() &&
                context.game.currentConflict.hasMoreParticipants(context.source.parent.controller.opponent),
            gameAction: AbilityDsl.actions.conditional((context) => ({
                condition: context.source.parent.getFate() === 0,
                trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.source.parent }),
                falseGameAction: AbilityDsl.actions.removeFate({ target: context.source.parent })
            }))
        });
    }
}
