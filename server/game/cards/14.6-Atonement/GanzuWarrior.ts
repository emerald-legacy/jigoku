import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
import { resolveRingEffect } from '../../GameActions/GameActions.js';

class GanzuWarrior extends DrawCard {
    static id = 'ganzu-warrior';

    override setupCardAbilities() {
        this.reaction('Resolve a ring effect')
            .when({
                onCardRevealed: (event, context) =>
                    event.card && event.card.type === CardType.Province && context.source.isParticipating()
            })
            .selectRing((context) => ({
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                targets: false,
                message: (context, ring) => msg`${context.player} resolves the ${ring}'s effect`,
                ringCondition: (ring) =>
                    !!context.event.card && context.event.card.isProvinceCard() && context.event.card.element.includes(ring.element),
                gameAction: resolveRingEffect({ player: context.player })
            }))
            .chatText('resolve a ring effect')
            .max(perConflict(1));
    }
}


export default GanzuWarrior;
