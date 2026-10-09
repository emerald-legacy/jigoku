import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { lookAt, moveCard, selectCard, sequential } from '../../GameActions/GameActions.js';
import { Location, Phase, CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class PeasantsAdvice extends DrawCard {
    static id = 'peasant-s-advice';

    setupCardAbilities() {
        this.action('look at a province and return its dynasty card to deck')
            .cost(costs.dishonor())
            .target({
                cardType: CardType.Province,
                location: Location.Provinces
            }, sequential([
                lookAt({
                    message: (context, cards) => msg`${context.source} sees ${cards[0]} in ${cards[0].location}`
                }),
                selectCard((context) => ({
                    activePromptTitle: 'Choose a faceup card to return to its owner\'s deck',
                    cardCondition: (card) =>
                        card.location === context.target?.location &&
                            card.controller === context.target?.controller &&
                            card.isDynasty && !card.facedown,
                    location: Location.Provinces,
                    optional: true,
                    message: (context, card) => msg`${context.player} chooses to shuffle ${card} into its owner's deck`,
                    gameAction: moveCard({
                        destination: Location.DynastyDeck,
                        shuffle: true
                    })
                }))
            ]))
            .chatText((context) => msg`look at ${context.target.controller}'s ${context.target.location}`)
            .phase(Phase.Conflict);
    }
}


export default PeasantsAdvice;
