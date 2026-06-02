import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ApprenticeEngineer extends DrawCard {
    static id = 'apprentice-engineer';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a holding in a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Holding,
                controller: Players.Self,
                location: Location.DynastyDiscardPile,
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose an unbroken province',
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.location !== Location.StrongholdProvince && !card.isBroken,
                    message: '{0} places {1} in {2}, discarding {3}',
                    messageArgs: card => [context.player, context.target, card.facedown ? card.location : card, context.player.getDynastyCardsInProvince(card.location)],
                    subActionProperties: card => ({ destination: card.location, target: context.player.getDynastyCardsInProvince(card.location) }),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.moveCard({
                            target: context.target,
                            faceup: true
                        }),
                        AbilityDsl.actions.discardCard()
                    ])
                }))
            },
            effect: 'put {0} into a province'
        });
    }
}


export default ApprenticeEngineer;
