import { CardTypes, ConflictTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { Conflict } from '../../../conflict';
import { AbilityContext } from '../../../AbilityContext';

export default class TwoHands extends DrawCard {
    static id = 'two-hands';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Add a character to the duel',
            duelCondition: (duel, context) => duel.challengingPlayer === context.player,
            target: {
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.duelAddParticipant((context) => ({
                    duel: (context as any).event.duel
                }))
            }
        });

        this.action({
            title: 'Set the skill of two enemy character to the lowest between them',
            condition: (context) =>
                context.game.currentConflict instanceof Conflict &&
                context.player.cardsInPlay.some(
                    (card: DrawCard) =>
                        card.isParticipating() && card.attachments.some((attachment) => attachment.hasTrait('weapon'))
                ) &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) >
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player),
            target: {
                activePromptTitle: 'Choose two characters',
                mode: TargetModes.Exactly,
                numCards: 2,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => {
                    const twoHands = calcTwoHandsEffect(context);
                    return {
                        target: twoHands.targets,
                        effect:
                            twoHands.type === 'military'
                                ? AbilityDsl.effects.setMilitarySkill(twoHands.value)
                                : AbilityDsl.effects.setPoliticalSkill(twoHands.value)
                    };
                })
            },
            effect: 'set {1} {2} skills equal to {3}',
            effectArgs: (context) => {
                const twoHands = calcTwoHandsEffect(context);
                return [twoHands.targets, twoHands.type, twoHands.value];
            }
        });
    }
}

function calcTwoHandsEffect(context: AbilityContext) {
    const targets = Array.isArray(context.target) ? context.target : context.target ? [context.target] : [];
    if((context.game.currentConflict as Conflict).conflictType === ConflictTypes.Military) {
        return {
            targets,
            type: 'military',
            value: Math.min(...targets.map((card: DrawCard) => card.getMilitarySkill()))
        };
    }

    return {
        targets,
        type: 'political',
        value: Math.min(...targets.map((card: DrawCard) => card.getPoliticalSkill()))
    };
}
