import { CardType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ZealousInspector extends DrawCard {
    static id = 'zealous-inspector';

    setupCardAbilities() {
        this.reaction({
            title: 'Take an additional action',
            when: {
                onCardDishonored: (event, context) =>
                    // character
                    event.card.type === CardType.Character &&
                    // controlled by opponent
                    event.card.controller === context.player.opponent &&
                    // dishonored by your card effect
                    context.player === event.context?.player &&
                    event.context?.source.type !== 'ring'
            },
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(1)
            })),
            effect: 'gain an additional action — time to deliver swift punishment for the wicked'
        });
    }
}
