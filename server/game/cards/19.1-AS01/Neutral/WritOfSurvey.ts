import { addKeyword, gainAbility } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class WritOfSurvey extends DrawCard {
    static id = 'writ-of-survey';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 }
        });

        this.persistentEffect({
            condition: (context) => !!context.source.parentCharacter?.isHonored,
            effect: addKeyword('ancestral')
        });

        this.whileAttached({
            effect: gainAbility.action('Bow a participating dishonored character', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .target({
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card) => card.isParticipating() && card.isDishonored
                }, bow()))
        });
    }

    public canPlayOn(source: BaseCard): boolean {
        return source.isHonored && super.canPlayOn(source);
    }
}
