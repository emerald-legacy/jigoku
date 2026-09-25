import { CardType, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class EarthsExamination extends DrawCard {
    static id = 'earth-s-examination';

    setupCardAbilities() {
        this.action('Taint a character')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Political) && context.player.isTraitInPlay('shugenja'))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.taint(),
                AbilityDsl.actions.onAffinity((context) => ({
                    trait: 'earth',
                    promptTitleForConfirmingAffinity: context.target.isTainted ? undefined : 'Bow that character?',
                    gameAction: AbilityDsl.actions.bow(),
                    effect: 'bow {0}',
                    effectArgs: (context) => [context.target]
                }))
            ]))
            .effect('reveal {1}\'s corruption', (context) => [context.target ?? '']);
    }
}
