import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

function skillBonus(companion: DrawCard): number {
    return companion.getGlory();
}

export default class SagenOfHoneyedWords extends DrawCard {
    static id = 'sagen-of-honeyed-words';

    public setupCardAbilities() {
        this.action({
            title: 'Gain a skill bonus based on your company',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source,
                effect: AbilityDsl.effects.modifyBothSkills(skillBonus(context.target))
            })),
            effect: 'get +{1}{2} and +{3}{4}',
            effectArgs: (context) => {
                const bonus = skillBonus(context.target as DrawCard);
                return [bonus, 'military', bonus, 'political'];
            }
        });
    }
}
