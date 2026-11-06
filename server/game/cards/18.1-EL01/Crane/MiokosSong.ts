import { msg } from '../../../GameChat.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { modifyBothSkills } from '../../../effects.js';
import { assignRoles, moveCard, placeInProvince } from '../../../GameActions/GameActions.js';

export default class MiokosSong extends StrongholdCard {
    static id = 'mioko-s-song';

    override setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) =>
                !!context && card.controller === context.player &&
                card.type === CardType.Character &&
                card.isDishonored &&
                card.isFaction('crane'),
            effect: modifyBothSkills(1)
        });

        this.reaction('Sabotage the opponent\'s resources')
            .when({
                onCardPlayed: (event, context) =>
                    context.player.opponent &&
                    event.player === context.player &&
                    event.card.type === CardType.Character
            })
            .cost(costs.bowSelf())
            .cost(costs.dishonor({ cardCondition: (card, context) => card === context.event.card }))
            .target({
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: CardType.Province
            })
            .gameAction(assignRoles((context) => ({
                target: context.player.opponent?.dynastyDeck.slice(0, 2) ?? [],
                roles: {
                    'put into the province faceup': placeInProvince({ destination: context.target.location, discard: 'all' }),
                    'put on the bottom of the deck': moveCard({ destination: Location.DynastyDeck, bottom: true })
                },
                pickOrder: ['put into the province faceup'],
                messages: {
                    'put into the province faceup': (_context, card) =>
                        msg`${context.player} puts ${card} into ${context.target.isFacedown() ? context.target.location : context.target}, discarding ${context.target.cardsInSelf()}`
                }
            })));
    }
}
