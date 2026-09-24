import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.action({
            title: 'Injure attached character',
            condition: (context) =>
                !!(this.game.isDuringConflict('military') &&
                context.source.parentCharacter &&
                context.source.parentCharacter.isParticipating() &&
                context.source.parentCharacter.controller.opponent &&
                context.game.currentConflict?.hasMoreParticipants(context.source.parentCharacter.controller.opponent, () => true)),
            gameAction: AbilityDsl.actions.conditional((context) => ({
                condition: context.source.parentCharacter?.getFate() === 0,
                trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.source.parentCharacter }),
                falseGameAction: AbilityDsl.actions.removeFate({ target: context.source.parentCharacter })
            }))
        });
    }
}
