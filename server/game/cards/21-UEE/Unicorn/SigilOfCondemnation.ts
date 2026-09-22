import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.action({
            title: 'Injure attached character',
            condition: (context) =>
                !!(this.game.isDuringConflict('military') &&
                context.source.attachedCharacter &&
                context.source.attachedCharacter.isParticipating() &&
                context.source.attachedCharacter.controller.opponent &&
                context.game.currentConflict?.hasMoreParticipants(context.source.attachedCharacter.controller.opponent, () => true)),
            gameAction: AbilityDsl.actions.conditional((context) => ({
                condition: context.source.attachedCharacter.getFate() === 0,
                trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.source.attachedCharacter }),
                falseGameAction: AbilityDsl.actions.removeFate({ target: context.source.attachedCharacter })
            }))
        });
    }
}
