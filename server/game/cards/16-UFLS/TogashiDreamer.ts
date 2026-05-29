import DrawCard from '../../DrawCard.js';
import { CardTypes, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiDreamer extends DrawCard {
    static id = 'togashi-dreamer';

    setupCardAbilities() {
        this.reaction({
            title: 'Move a fate from a character to a ring',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('kiho') && context.source.isParticipating()
            },
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    cardCondition: card => card.hasStatusTokens && card.isParticipating()
                },
                ring: {
                    mode: TargetModes.Ring,
                    dependsOn: 'character',
                    activePromptTitle: 'Choose an unclaimed ring to move fate to',
                    ringCondition: ring => ring.isUnclaimed(),
                    gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ origin: context.targets.character }))
                }
            }
        });
    }
}


export default TogashiDreamer;
