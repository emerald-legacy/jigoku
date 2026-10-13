import { msg } from '../../../GameChat.js';
import { modifyGlory } from '../../../effects.js';
import { assignRoles, chatMessage, conditional, discardCard, loseHonor, moveCard, placeInProvince, sequential } from '../../../GameActions/GameActions.js';
import { targetList } from '../../../GameActions/GameAction.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';


export default class CeremonialRobes extends DrawCard {
    static id = 'ceremonial-robes';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory((_character, context) =>
                context.player.cardsInPlay.reduce(
                    (sum, card) => (card.type === CardType.Character && card.hasTrait('spirit') ? sum + 1 : sum),
                    0
                )
            )
        });

        this.action('Place a card from your deck faceup on a province')
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.location !== Location.StrongholdProvince,
                controller: Players.Self
            })
            .gameAction(assignRoles((context) => ({
                target: context.player.dynastyDeck.slice(0, 3),
                roles: {
                    'put into the province faceup': placeInProvince({ destination: context.target.location }),
                    'put on the bottom of the deck': moveCard({ destination: Location.DynastyDeck, bottom: true }),
                    'discard': sequential([
                        discardCard(),
                        conditional({
                            condition: (_context, properties) => targetList(properties.target).some((card) => card.isCard() && card.hasTrait('spirit')),
                            trueGameAction: sequential([
                                chatMessage((context, [card]) => msg`${card} was a Spirit! ${context.player} and ${context.player.opponent} lose 1 honor`),
                                loseHonor((context) => ({ target: context.game.getPlayers() }))
                            ])
                        })
                    ])
                },
                pickOrder: ['put into the province faceup', 'put on the bottom of the deck'],
                messages: {
                    'put into the province faceup': (context, card) => msg`${context.player} places ${card} into their province`,
                    'put on the bottom of the deck': (context) => msg`${context.player} places a card on the bottom of the deck`,
                    'discard': (context, card) => msg`${context.player} discards ${card}`
                }
            })))
            .chatText('look at the top 3 cards of their dynasty deck')
            .evenDuringDynasty();
    }
}
