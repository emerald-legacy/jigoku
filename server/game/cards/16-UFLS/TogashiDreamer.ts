import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiDreamer extends DrawCard {
    static id = 'togashi-dreamer';

    setupCardAbilities() {
        this.reaction('Move a fate from a character to a ring')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('kiho') && context.source.isParticipating()
            })
            .target('character', {
                cardType: CardType.Character,
                cardCondition: card => card.hasStatusTokens && card.isParticipating()
            })
            .ringTarget('ring', {
                dependsOn: 'character',
                activePromptTitle: 'Choose an unclaimed ring to move fate to',
                ringCondition: ring => ring.isUnclaimed()
            }, AbilityDsl.actions.placeFateOnRing(context => ({ origin: context.targets.character })));
    }
}


export default TogashiDreamer;
