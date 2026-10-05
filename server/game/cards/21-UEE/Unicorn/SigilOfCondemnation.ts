import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.action('Injure attached character')
            .condition((context) =>
                !!(this.game.isDuringConflict('military') &&
                context.source.parentCharacter &&
                context.source.parentCharacter.isParticipating() &&
                context.source.parentCharacter.controller.opponent &&
                context.game.currentConflict?.hasMoreParticipants(context.source.parentCharacter.controller.opponent, () => true)))
            .gameAction(AbilityDsl.actions.injure((context) => ({ target: context.source.parentCharacter ?? [] })));
    }
}
