import { msg } from '../../GameChat.js';
import { Location, CardType, Players } from '../../Constants.js';
import { canBeSeenWhenFacedown } from '../../effects.js';
import { chooseAction, discardCard, moveCard, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AsahinaTakako extends DrawCard {
    static id = 'asahina-takako';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card) => card.isDynasty && card.isFacedown(),
            effect: canBeSeenWhenFacedown()
        });

        this.action('Discard a card or switch with another card')
            .target({
                cardType: [CardType.Character, CardType.Holding, CardType.Event],
                location: Location.Provinces,
                controller: Players.Self
            }, chooseAction((context) => ({
                choices: {
                    Discard: discardCard({ target: context.target }),
                    'Switch with another card': {
                        action: selectCard({
                            activePromptTitle: 'Choose a card to switch with',
                            cardType: [CardType.Character, CardType.Holding, CardType.Event],
                            location: Location.Provinces,
                            controller: Players.Self,
                            message: (context, card) => msg`${context.player} switches ${context.target?.isFacedown() ? 'a facedown card' : context.target ?? ''} in ${context.target?.location ?? ''} and ${card.isFacedown() ? 'a facedown card' : card} in ${card.location}`,
                            gameAction: moveCard({
                                destination: context.target?.location,
                                switch: true,
                                switchTarget: context.target
                            })
                        }),
                        message: (_context, target, player) => msg`${player} chooses to discard ${target}`
                    }
                }
            })))
            .chatText((context) => msg`switch or discard ${context.target.isFacedown() ? 'a facedown card' : context.target} in ${context.target.location}`);
    }
}
