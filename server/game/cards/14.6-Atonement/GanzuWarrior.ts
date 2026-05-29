import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class GanzuWarrior extends DrawCard {
    static id = 'ganzu-warrior';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve a ring effect',
            when: {
                onCardRevealed: (event, context) =>
                    event.card && event.card.type === CardTypes.Province && context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.selectRing((context) => ({
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                targets: false,
                message: '{0} resolves the {1}\'s effect',
                ringCondition: (ring) =>
                    context.event.card.element.includes(ring.element),
                messageArgs: (ring) => [context.player, ring],
                gameAction: AbilityDsl.actions.resolveRingEffect({ player: context.player })
            })),
            effect: 'resolve a ring effect',
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}


export default GanzuWarrior;
