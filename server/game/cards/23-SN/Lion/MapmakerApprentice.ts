import { msg } from '../../../GameChat.js';
import { CardType, Duration, Location, Players } from '../../../Constants.js';
import { delayedEffect, modifyProvinceStrength } from '../../../effects.js';
import { cardLastingEffect, chooseAction, playerLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MapmakerApprentice extends DrawCard {
    static id = 'mapmaker-apprentice';

    setupCardAbilities() {
        this.action('Map a province')
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Any
            }, playerLastingEffect((context) => ({
                effect: delayedEffect({
                    when: {
                        onCardPlayed: (event, eventContext) => {
                            if(!eventContext.game.currentConflict) {
                                return false;
                            }
                            if(!context.target.isConflictProvince()) {
                                return false;
                            }
                            if(event.player !== context.player || event.card.type !== CardType.Event) {
                                return false;
                            }
                            const eventsPlayed = eventContext.game.currentConflict.getCardsPlayed(context.player, (card) => card.type === CardType.Event).length;
                            return eventsPlayed <= 1;
                        }
                    },
                    message: () => msg`${context.player} changes the province strength of an attacked province due to the delayed effect of ${context.source}`,
                    multipleTrigger: true,
                    gameAction: selectCard((context) => ({
                        activePromptTitle: 'Choose an attacked province',
                        hidePromptIfSingleCard: true,
                        cardType: CardType.Province,
                        location: Location.Provinces,
                        cardCondition: (card) => card.isConflictProvince(),
                        subActionProperties: (card) => {
                            context.target = card;
                            return { target: card };
                        },
                        gameAction: chooseAction({
                            options: {
                                'Raise attacked province\'s strength by 2': {
                                    action: cardLastingEffect({
                                        targetLocation: Location.Provinces,
                                        effect: modifyProvinceStrength(2)
                                    }),
                                    message: (_context, target, player) => msg`${player} chooses to increase ${target}'s strength by 2`
                                },
                                'Lower attacked province\'s strength by 2': {
                                    action: cardLastingEffect({
                                        targetLocation: Location.Provinces,
                                        effect: modifyProvinceStrength(-2)
                                    }),
                                    message: (_context, target, player) => msg`${player} chooses to reduce ${target}'s strength by 2`
                                }
                            }
                        })
                    }))
                }),
                duration: Duration.UntilEndOfRound
            })))
            .chatText('map {1}{2}{3} - the first event they play during each conflict at that province will also modify its strength', (context) => context.target.facedown ? [context.target.controller, '\'s ', context.target.location] : ['', '', context.target]);
    }
}
