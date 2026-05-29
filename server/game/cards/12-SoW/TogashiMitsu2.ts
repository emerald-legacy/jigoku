import DrawCard from '../../DrawCard.js';
import { Players, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { RingEffects } from '../../RingEffects.js';

class TogashiMitsu2 extends DrawCard {
    static id = 'togashi-mitsu-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action({
            title: 'Resolve a ring effect',
            condition: context => context.source.isParticipating() && !!this.game.currentConflict && this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 5,
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                ringCondition: (ring, context) => !!context && RingEffects.contextFor(context.player, ring.element, false).ability.hasLegalTargets(context),
                gameAction: AbilityDsl.actions.resolveRingEffect(context => ({ player: context.player }))
            },
            effect: 'resolve the {0}\'s effect'
        });
    }
}


export default TogashiMitsu2;
