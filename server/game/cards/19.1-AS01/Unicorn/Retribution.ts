import { perRound } from '../../../AbilityLimit.js';
import { additionalConflict, cannotBeDeclaredAsAttacker, mustBeDeclaredAsAttacker } from '../../../effects.js';
import {
    cardLastingEffect,
    initiateConflict,
    playerLastingEffect,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Duration, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import { msg } from '../../../GameChat.js';

function brokenProvinceCountForPlayer(player: Player): number {
    return player.getProvinceCards().reduce((sum, province) => (province.isBroken ? sum + 1 : sum), 0);
}

export default class Retribution extends DrawCard {
    static id = 'retribution-';

    public override setupCardAbilities() {
        this.reaction('Immediately declare a military conflict')
            .when({
                onConflictFinished: (event, context) =>
                    // Lost conflict as defender
                    event.conflict.attackingPlayer === context.player.opponent &&
                    event.conflict.winner === context.player.opponent &&
                    // Equal or more broken provinces
                    brokenProvinceCountForPlayer(context.player) >=
                        brokenProvinceCountForPlayer(context.player.opponent)
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    // honored or battlemaiden
                    (card.isHonored || card.hasTrait(Trait.BattleMaiden)) &&
                    // can attack military
                    Object.values(this.game.rings).some(
                        (ring) =>
                            ring.canDeclare(context.player) && card.canDeclareAsAttacker(ConflictType.Military, ring)
                    )
            }, sequential((context) => [
                cardLastingEffect({
                    effect: mustBeDeclaredAsAttacker(),
                    target: context.target
                }),
                cardLastingEffect({
                    effect: cannotBeDeclaredAsAttacker(),
                    target: context.player.cardsInPlay.filter(
                        (card) => card.type === CardType.Character && card !== context.target
                    )
                }),
                playerLastingEffect({
                    target: Players.Self,
                    duration: Duration.UntilEndOfPhase,
                    effect: additionalConflict(ConflictType.Military)
                }),
                initiateConflict({
                    target: context.player,
                    canPass: false,
                    forcedDeclaredType: ConflictType.Military
                })
            ]))
            .chatText((context) => msg`declare a military conflict, attacking with ${context.target}`)
            .max(perRound(1));
    }
}
