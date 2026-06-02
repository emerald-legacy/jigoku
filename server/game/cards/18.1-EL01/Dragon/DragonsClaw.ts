import AbilityDsl from '../../../abilitydsl.js';
import { AbilityType, CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { ActionProps } from '../../../Interfaces.js';

export default class DragonsClaw extends DrawCard {
    static id = 'dragon-s-claw';

    setupCardAbilities() {
        this.whileAttached({
            match: (card: DrawCard) => card.attachments.some((a) => a.name === 'Dragon\'s Fang'),
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Bow and send home a participating character with lower military skill',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) =>
                        card.isParticipating() && card.getMilitarySkill() < context.source.getMilitarySkill(),
                    gameAction: AbilityDsl.actions.multiple([AbilityDsl.actions.bow(), AbilityDsl.actions.sendHome()])
                }
            } as ActionProps<DrawCard>)
        });
    }
}
