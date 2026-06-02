import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { AbilityType, CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { ActionProps } from '../../../Interfaces.js';

export default class WritOfSanctification extends DrawCard {
    static id = 'writ-of-sanctification';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: 'shugenja'
        });

        this.persistentEffect({
            condition: (context) =>
                !(context.player.cardsInPlay as BaseCard[]).some(
                    (card) => card.hasTrait('shadowlands') && card.type === CardType.Character
                ),
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Bow corrupt character',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    mode: TargetMode.Single,
                    cardCondition: (card) => card.isParticipating() && (card.hasTrait('shadowlands') || card.isTainted),
                    gameAction: AbilityDsl.actions.bow()
                }
            } as ActionProps)
        });
    }
}
