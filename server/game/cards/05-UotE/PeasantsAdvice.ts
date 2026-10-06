import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { lookAt, moveCard, selectCard, sequential } from '../../GameActions/GameActions.js';
import { Location, Phases, CardType } from '../../Constants.js';

class PeasantsAdvice extends DrawCard {
    static id = 'peasant-s-advice';

    setupCardAbilities() {
        this.action('look at a province and return its dynasty card to deck')
            .cost(AbilityDsl.costs.dishonor())
            .target({
                cardType: CardType.Province,
                location: Location.Provinces
            }, sequential([
                lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                })),
                selectCard(context => ({
                    activePromptTitle: 'Choose a faceup card to return to its owner\'s deck',
                    cardCondition: card =>
                        card.location === context.target?.location &&
                            card.controller === context.target?.controller &&
                            card.isDynasty && !card.facedown,
                    location: Location.Provinces,
                    optional: true,
                    message: '{0} chooses to shuffle {1} into its owner\'s deck',
                    messageArgs: card => [context.player, card],
                    gameAction: moveCard({
                        destination: Location.DynastyDeck,
                        shuffle: true
                    })
                }))
            ]))
            .effect('look at {1}\'s {2}', context => [context.target.controller, context.target.location])
            .phase(Phases.Conflict);
    }
}


export default PeasantsAdvice;
