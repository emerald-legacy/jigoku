import AbilityDsl from '../../../abilitydsl.js';
import { CardType, ConflictType, Duration, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

function brokenProvinceCountForPlayer(player: Player): number {
    return player.getProvinceCards().reduce((sum, province) => (province.isBroken ? sum + 1 : sum), 0);
}

export default class Retribution extends DrawCard {
    static id = 'retribution-';

    public setupCardAbilities() {
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
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    // honored or battlemaiden
                    (card.isHonored || card.hasTrait('battle-maiden')) &&
                    // can attack military
                    Object.values(this.game.rings).some(
                        (ring) =>
                            ring.canDeclare(context.player) && card.canDeclareAsAttacker(ConflictType.Military, ring)
                    )
            }, AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Duration.UntilEndOfConflict,
                        effect: AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                        target: context.target
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Duration.UntilEndOfConflict,
                        effect: AbilityDsl.effects.cannotBeDeclaredAsAttacker(),
                        target: context.player.cardsInPlay.filter(
                            (card) => card.getType() === CardType.Character && card !== context.target
                        )
                    }),
                    AbilityDsl.actions.playerLastingEffect({
                        targetController: context.player,
                        duration: Duration.UntilEndOfPhase,
                        effect: AbilityDsl.effects.additionalConflict('military')
                    }),
                    AbilityDsl.actions.initiateConflict({
                        target: context.player,
                        canPass: false,
                        forcedDeclaredType: ConflictType.Military
                    })
                ]
            })))
            .effect('declare a military conflict, attacking with {1}', (context) => [context.target ?? ''])
            .max(AbilityDsl.limit.perRound(1));
    }
}
