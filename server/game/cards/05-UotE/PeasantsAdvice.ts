import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Phases, CardType } from '../../Constants.js';

class PeasantsAdvice extends DrawCard {
    static id = 'peasant-s-advice';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'look at a province and return its dynasty card to deck',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.dishonor(),
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.lookAt(context => ({
                        message: '{0} sees {1} in {2}',
                        messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                    })),
                    AbilityDsl.actions.selectCard<DrawCard>(context => ({
                        activePromptTitle: 'Choose a faceup card to return to its owner\'s deck',
                        cardCondition: card =>
                            card.location === context.target?.location &&
                            card.controller === context.target?.controller &&
                            card.isDynasty && !card.facedown,
                        location: Location.Provinces,
                        optional: true,
                        message: '{0} chooses to shuffle {1} into its owner\'s deck',
                        messageArgs: card => [context.player, card],
                        gameAction: AbilityDsl.actions.moveCard({
                            destination: Location.DynastyDeck,
                            shuffle: true
                        })
                    }))
                ])
            },
            effect: 'look at {1}\'s {2}',
            effectArgs: context => [context.target?.controller ?? '', context.target?.location ?? '']
        });
    }
}


export default PeasantsAdvice;
