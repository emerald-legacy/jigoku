import DrawCard from '../../DrawCard.js';
import { CardTypes, Durations, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AgashaTaiko extends DrawCard {
    static id = 'agasha-taiko';

    setupCardAbilities() {
        this.reaction<DrawCard>({
            title: 'Choose a province',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Locations.Provinces,
                    duration: Durations.UntilEndOfRound,
                    effect: AbilityDsl.effects.cannotBeAttacked()
                })
            },
            effect: 'prevent {1}\'s {2} in {3} from being attacked this round',
            effectArgs: context => [
                context.target?.controller ?? '',
                context.target?.isFacedown() ? 'hidden province' : context.target ?? '',
                context.target?.location ?? ''
            ]
        });
    }
}


export default AgashaTaiko;
