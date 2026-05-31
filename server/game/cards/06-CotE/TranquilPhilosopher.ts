import DrawCard from '../../DrawCard.js';
import type Ring from '../../Ring.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes } from '../../Constants.js';

class TranquilPhilosopher extends DrawCard {
    static id = 'tranquil-philosopher';

    setupCardAbilities() {
        this.action({
            title: 'Move fate on rings',
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring: any) => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.selectRing((context: AbilityContext) => ({
                        activePromptTitle: 'Choose an unclaimed ring to move fate to',
                        ringCondition: (ring: any) => (context.ring as Ring).fate > 0 && ring.isUnclaimed() && ring !== (context.ring as Ring),
                        message: '{0} moves a fate from the {1} to the {2}',
                        messageArgs: (ring: any) => [context.player, context.ring, ring],
                        gameAction: AbilityDsl.actions.placeFateOnRing({ origin: context.ring })
                    })),
                    AbilityDsl.actions.gainHonor((context: AbilityContext) => ({ target: context.player }))
                ])
            },
            effect: '{1}{2}{3}',
            effectArgs: (context: AbilityContext) => (context.ring && context.ring.fate > 0) ?
                ['move 1 fate from the ', context.ring, ' to an unclaimed ring, then gain 1 honor'] :
                ['gain 1 honor', '', '']
        });
    }
}


export default TranquilPhilosopher;
