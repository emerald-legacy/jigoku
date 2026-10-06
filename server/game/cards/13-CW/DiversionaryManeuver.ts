import DrawCard from '../../DrawCard.js';
import { Location, CardType, Players, TargetMode, ConflictType } from '../../Constants.js';
import {
    bow,
    moveConflict,
    moveToConflict,
    multiple,
    selectCards,
    sendHome,
    sequential
} from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class DiversionaryManeuver extends DrawCard {
    static id = 'diversionary-maneuver';

    setupCardAbilities() {
        this.action('Move the conflict to another province')
            .condition(context => context.game.isDuringConflict(ConflictType.Military) && context.player.isAttackingPlayer())
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card, context) => !card.isConflictProvince() && card.canBeAttacked() && (context.game.currentConflict?.getConflictProvinces() ?? []).some((a) => a.controller === card.controller)
            })
            .gameAction(sequential([
                multiple([
                    bow(context => ({
                        target: context.game.currentConflict?.getParticipants()
                    })),
                    sendHome(context => ({
                        target: context.game.currentConflict?.getParticipants()
                    })),
                    moveConflict(context => ({
                        target: context.target })),
                    selectCards({
                        cardType: CardType.Character,
                        location: Location.PlayArea,
                        controller: Players.Self,
                        player: Players.Self,
                        optional: true,
                        mode: TargetMode.Unlimited,
                        cardCondition: card => !card.bowed,
                        message: '{0} moves {1} to the conflict',
                        messageArgs: (card, player) => [player, card.length > 0 ? card : 'no one'],
                        gameAction: moveToConflict()
                    })
                ]),
                selectCards({
                    cardType: CardType.Character,
                    location: Location.PlayArea,
                    controller: Players.Opponent,
                    player: Players.Opponent,
                    optional: true,
                    mode: TargetMode.Unlimited,
                    cardCondition: card => !card.bowed,
                    message: '{0} moves {1} to the conflict',
                    messageArgs: (card, player) => [player, card.length > 0 ? card : 'no one'],
                    gameAction: moveToConflict()
                })
            ]))
            .effect((context) => msg`move the conflict to ${context.target} and send all participating characters home bowed`);
    }
}


export default DiversionaryManeuver;

