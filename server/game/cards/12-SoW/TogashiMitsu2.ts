import DrawCard from '../../DrawCard.js';
import { Players, RestrictionType, RestrictionScope } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { resolveRingEffect } from '../../GameActions/GameActions.js';
import { RingAbilities } from '../../RingAbilities.js';

class TogashiMitsu2 extends DrawCard {
    static id = 'togashi-mitsu-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({
                cannot: RestrictionType.ApplyCovert,
                appliesTo: RestrictionScope.OpponentsCardEffects
            })
        });

        this.action('Resolve a ring effect')
            .condition((context) => context.source.isParticipating() && !!this.game.currentConflict && this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 5)
            .ringTarget({
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                ringCondition: (ring, context) => RingAbilities.contextFor(context.player, ring.element, false).ability.hasLegalTargets(context)
            }, resolveRingEffect((context) => ({ player: context.player })))
            .chatText('resolve the {0}\'s effect');
    }
}


export default TogashiMitsu2;
