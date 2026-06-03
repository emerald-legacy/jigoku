import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { AbilityType, CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { ActionProps } from '../../../Interfaces.js';

export default class WritOfSurvey extends DrawCard {
    static id = 'writ-of-survey';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 }
        });

        this.persistentEffect({
            condition: (context) => !!context.source.parent?.isHonored,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Bow a participating dishonored character',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    mode: TargetMode.Single,
                    cardCondition: (card) => card.isParticipating() && card.isDishonored,
                    gameAction: AbilityDsl.actions.bow()
                }
            } as ActionProps<this>)
        });
    }

    public canPlayOn(source: BaseCard): boolean {
        return source.isHonored && super.canPlayOn(source);
    }
}
