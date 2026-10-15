import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, Players, TargetMode, Trait } from '../../../Constants.js';
import { setMilitarySkill, setPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, duelAddParticipant } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class TwoHands extends DrawCard {
    static id = 'two-hands';

    override setupCardAbilities() {
        this.duelChallenge('Add a character to the duel', (duel, context) => duel.challengingPlayer === context.player)
            .target({
                controller: Players.Opponent
            }, duelAddParticipant((context) => ({
                duel: context.event.duel
            })));

        this.action('Set the skill of two enemy character to the lowest between them')
            .condition((context) =>
                !!context.game.currentConflict &&
                context.player.cardsInPlay.some(
                    (card) =>
                        card.isParticipating() && card.attachments.some((attachment) => attachment.hasTrait(Trait.Weapon))
                ) &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) >
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player))
            .targetCards({
                activePromptTitle: 'Choose two characters',
                mode: TargetMode.Exactly,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => {
                const twoHands = calcTwoHandsEffect(context, context.targets.target);
                return {
                    target: twoHands.targets,
                    effect:
                            twoHands.type === ConflictType.Military
                                ? setMilitarySkill(twoHands.value)
                                : setPoliticalSkill(twoHands.value)
                };
            }))
            .chatText((context) => {
                const twoHands = calcTwoHandsEffect(context, context.targets.target);
                return msg`set ${twoHands.targets} ${twoHands.type} skills equal to ${twoHands.value}`;
            });
    }
}

function calcTwoHandsEffect(context: AbilityContext, chosen: DrawCard | DrawCard[]) {
    const targets = Array.isArray(chosen) ? chosen : [chosen];
    if(context.game.requireConflict().conflictType === ConflictType.Military) {
        return {
            targets,
            type: ConflictType.Military,
            value: Math.min(...targets.map((card) => card.militarySkill))
        };
    }

    return {
        targets,
        type: ConflictType.Political,
        value: Math.min(...targets.map((card) => card.politicalSkill))
    };
}
